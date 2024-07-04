'use client'
import { GET } from '@/services/api';
import { useDebounce } from '@/utils/hooks/useDebounce'
import React, { FC, useEffect, useState } from 'react';

interface ISuggestion {
    mapbox_id: string;
    name: string;
}

interface IProps {
    onSelect: (location: any) => void
}

const SearchUrl = 'https://api.mapbox.com/search/searchbox/v1/suggest'

const SpecificLocUrl = 'https://api.mapbox.com/search/searchbox/v1/retrieve'

let keys = {
    access_token: 'pk.eyJ1IjoiaGVsbG9tZGV4IiwiYSI6ImNsb2x1bno1ODBwMXIycW1yYjNpam9oejMifQ.9u_QctlIhzYi22zPFXJG1Q',
    session_token: 'pk.eyJ1IjoiaGVsbG9tZGV4IiwiYSI6ImNscDEwYmQxaDBlenUya3BibmRxZmppajIifQ.1eegP6heWSE9k4DGX3t4-w&country=US'
}


export const LocationDropdown: FC<IProps> = ({ onSelect }) => {
    const [search, setSearch] = useState('')
    const [searchToShow, setSearchToShow] = useState('')
    const [options, setOptions] = useState<ISuggestion[]>([]);
    const [showSuggestions, setshowSuggestions] = useState(false)
    const debouncedSearch = useDebounce(search, 1000);

    useEffect(() => {
        if (debouncedSearch) {
            handleSearch()
        } else {
            setshowSuggestions(false)
        }
    }, [debouncedSearch])

    const handleSearch = async () => {
        setshowSuggestions(true)
        let params = {
            ...keys,
            q: debouncedSearch,
            bbox: '-83.7998,42.2226,-83.6753,42.3238'
        }
        try {
            const res = await GET(`${SearchUrl}?${new URLSearchParams(params)}`,) as { suggestions: ISuggestion[] }
            if (res.suggestions.length) {
                setOptions(res?.suggestions)
            }
        } catch (error) {
            //console.log(error)
        }
    }

    const handleSelect = async (obj: ISuggestion) => {
        setshowSuggestions(false)
        setSearchToShow(obj.name)

        const response: any = await GET(`${SpecificLocUrl}/${obj.mapbox_id}?${new URLSearchParams(keys)}`)

        if (response?.features?.length) {
            let location = response.features[0]
            let address = {
                addressLine1: location?.properties?.full_address || location?.properties?.place_formatted || '',
                postalCode: location?.properties?.context?.postcode?.name || '',
                city: location?.properties?.context?.place?.name || '',
                state: location?.properties?.context?.region?.name || '',
                country: location?.properties?.context?.country?.name || '',
                map_id: location?.properties?.mapbox_id || ''
            }
            onSelect(address)
        }

    }

    return (
        <div className='relative'>
            <input type="text" className='w-full focus:outline-none' value={searchToShow} onChange={(e) => {
                setSearch(e.target.value);
                setSearchToShow(e.target.value)
            }} placeholder="Search for a location" />
            {showSuggestions && <div className='absolute bg-white rounded-lg border p-4 -bottom-52 w-full'>
                {options.map((option, index) => (
                    <div
                        key={index}
                        className='hover:bg-gray-200 p-1 rounded-lg cursor-pointer'
                        onClick={() => handleSelect(option)}
                    >
                        {option.name}
                    </div>
                ))}
            </div>}
        </div>
    )
}

