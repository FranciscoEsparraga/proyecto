import { Outlet, useNavigate } from 'react-router-dom'

import useAuth from '../hooks/useAuth.js'
import { useEffect } from 'react'

function PrivateRoutes() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) return navigate('/login')
  }, [])

  return <Outlet />
}

export default PrivateRoutes
