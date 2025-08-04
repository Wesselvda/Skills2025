// pages/Settings.js
import { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../contexts/ThemeContext'

export default function Settings() {
    const { theme, setTheme } = useContext(ThemeContext)
    const [sortPref, setSortPref] = useState('alphabet')

    useEffect(() => {
        const savedSort = localStorage.getItem('carparkSort') || 'alphabet'
        setSortPref(savedSort)
    }, [])

    const handleSortChange = (val) => {
        setSortPref(val)
        localStorage.setItem('carparkSort', val)
    }

    const handleThemeChange = (val) => {
        setTheme(val)
    }

    return (
        <div className="settings-page">
            <section>
                <h3>Theme</h3>
                <label>
                    <input
                        type="radio"
                        checked={theme === 'light'}
                        onChange={() => handleThemeChange('light')}
                    />
                    Light
                </label>
                <label>
                    <input
                        type="radio"
                        checked={theme === 'dark'}
                        onChange={() => handleThemeChange('dark')}
                    />
                    Dark
                </label>
                <label>
                    <input
                        type="radio"
                        checked={theme === 'system'}
                        onChange={() => handleThemeChange('system')}
                    />
                    System Default
                </label>
            </section>

            <section>
                <h3>Carpark Sorting</h3>
                <label>
                    <input
                        type="radio"
                        checked={sortPref === 'alphabet'}
                        onChange={() => handleSortChange('alphabet')}
                    />
                    Alphabetical
                </label>
                <label>
                    <input
                        type="radio"
                        checked={sortPref === 'distance'}
                        onChange={() => handleSortChange('distance')}
                    />
                    By Distance
                </label>
            </section>
        </div>
    )
}
