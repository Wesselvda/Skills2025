import { useEffect, useState, useRef } from 'react'
import { fetchEvents } from '../services/api'

const API_BASE = 'http://127.0.0.1:3001'

export default function Events() {
    const [events, setEvents] = useState([])
    const [nextPage, setNextPage] = useState(null)
    const [beginDate, setBeginDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const loadingRef = useRef(false)

    const normalizeEventData = (data) => {
        const updatedPages = {
            next: data.pages?.next ? API_BASE + data.pages.next : null,
            prev: data.pages?.prev ? API_BASE + data.pages.prev : null
        }
        return { events: data.events, pages: updatedPages }
    }

    const loadEvents = (url = null, reset = false) => {
        if (loadingRef.current) return
        loadingRef.current = true

        const fetchFn = url
            ? () => fetch(url).then(res => res.json())
            : () => fetchEvents(beginDate, endDate)

        fetchFn()
            .then(normalizeEventData)
            .then(data => {
                setEvents(prev => reset ? data.events : [...prev, ...data.events])
                setNextPage(data.pages.next)
            })
            .catch(console.error)
            .finally(() => {
                loadingRef.current = false
            })
    }

    useEffect(() => {
        loadEvents(null, true)
    }, [beginDate, endDate])

    useEffect(() => {
        const listEl = document.querySelector(".main-content");
        if (!listEl) return

        const onScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = listEl
            if (scrollTop + clientHeight >= scrollHeight - 300 && nextPage) {
                loadEvents(nextPage)
            }
        }

        listEl.addEventListener('scroll', onScroll)
        return () => listEl.removeEventListener('scroll', onScroll)
    }, [nextPage])

    return (
        <div className="events-page">
            <div className="filters">
                <label>
                    Start Date:
                    <input type="date" value={beginDate} onChange={e => setBeginDate(e.target.value)} />
                </label>
                <label>
                    End Date:
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </label>
            </div>

            <div
                className="event-list"
            >
                {events.map((event, idx) => (
                    <div className="event-card" key={idx}>
                        <img src={event.image} alt={event.title} loading="lazy" />
                        <div>
                            <h3>{event.title}</h3>
                            <p>{event.date}</p>
                        </div>
                    </div>
                ))}
                {nextPage && <p>Loading more...</p>}
            </div>
        </div>
    )
}