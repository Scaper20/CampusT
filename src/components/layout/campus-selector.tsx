'use client'

import { useState, useEffect } from 'react'
import { Check, ChevronDown, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { getCampuses } from '@/app/actions/campuses'

export function CampusSelector() {
  const [campuses, setCampuses] = useState<any[]>([])
  const [selectedCampus, setSelectedCampus] = useState<any>(null)

  useEffect(() => {
    async function fetchCampuses() {
      const data = await getCampuses()
      setCampuses(data)
      // For demo purposes, pick the first one or a default
      if (data.length > 0) setSelectedCampus(data[0])
    }
    fetchCampuses()
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 h-9 rounded-full hover:bg-muted transition-colors px-4 border"
        >
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold whitespace-nowrap">
            {selectedCampus?.name || 'Select Campus'}
          </span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px] rounded-xl shadow-card">
        {campuses.map((campus) => (
          <DropdownMenuItem
            key={campus.id}
            onClick={() => setSelectedCampus(campus)}
            className="flex items-center justify-between py-2 cursor-pointer"
          >
            <span className="text-sm font-medium">{campus.name}</span>
            {selectedCampus?.id === campus.id && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
