import { useCallback, useState } from 'react'

export const useInput = (initial = '') => {
    const [value, setValue] = useState(initial)
    const onChange = useCallback(e => setValue(e.target.value), [])
    return [value, onChange]
}