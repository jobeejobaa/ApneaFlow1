// ============================================================
// useCourses — Fetch les cours depuis l'API
//
// Custom hook qui encapsule :
// - le chargement (loading)
// - les données (courses)
// - les erreurs (error)
// - le re-fetch manuel (refetch)
//
// Usage :
//   const { courses, loading, error, refetch } = useCourses({ level: 'AIDA2' })
// ============================================================

import { useState, useEffect, useCallback } from 'react'
import { coursesAPI } from '../services/api'

export function useCourses(filters = {}) {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCourses = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await coursesAPI.getAll(filters)
      setCourses(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.level, filters.location])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  return { courses, loading, error, refetch: fetchCourses }
}
