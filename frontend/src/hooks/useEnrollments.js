import { useState, useEffect, useCallback } from 'react'
import { enrollmentsAPI } from '../services/api'

export function useEnrollments() {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchEnrollments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await enrollmentsAPI.getMy()
      setEnrollments(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEnrollments()
  }, [fetchEnrollments])

  // Vérifie si l'user est inscrit à un cours donné
  const isEnrolled = (courseId) =>
    enrollments.some(e => e.courseId === courseId)

  return { enrollments, loading, error, refetch: fetchEnrollments, isEnrolled }
}
