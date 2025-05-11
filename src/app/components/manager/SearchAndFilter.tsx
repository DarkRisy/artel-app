import React, { useEffect, useState } from 'react'
import { logout } from '@/app/api/auth/logout'
import { OrderStatus } from './types'
import { StatusFilter } from './StatusFilter'
import { SearchInput } from './SearchInput'

export interface SearchAndFilterProps {
  searchTerm: string
  statusFilter: OrderStatus | 'all'
  onSearchChange: (value: string) => void
  onStatusChange: (value: OrderStatus | 'all') => void
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusChange,
}) => {
  return (
    <div className="flex items-center flex-col md:flex-row gap-4 mb-8">
      <SearchInput value={searchTerm} onChange={onSearchChange} />
      <StatusFilter value={statusFilter} onChange={onStatusChange} />
      <button
        onClick={() => { logout() }}
        className="top-4 right-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Выйти
      </button>
    </div>
  )
}

export default SearchAndFilter