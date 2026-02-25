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
import { getUniversities } from '@/app/actions/universities'

export function UniversitySelector() {
  const [universities, setUniversities] = useState<any[]>([])
  const [selectedUniversity, setSelectedUniversity] = useState<any>(null)

  useEffect(() => {
    async function fetchUniversities() {
      const data = await getUniversities()
      setUniversities(data)
      // For demo purposes, pick the first one or a default
      if (data.length > 0) setSelectedUniversity(data[0])
    }
    fetchUniversities()
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
            {selectedUniversity?.name || 'Select University'}
          </span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px] rounded-xl shadow-card">
        {universities.map((university) => (
          <DropdownMenuItem
            key={university.id}
            onClick={() => setSelectedUniversity(university)}
            className="flex items-center justify-between py-2 cursor-pointer"
          >
            <span className="text-sm font-medium">{university.name}</span>
            {selectedUniversity?.id === university.id && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
