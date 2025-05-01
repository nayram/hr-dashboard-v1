"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export const roleCategories = [
  { id: "product", label: "Product" },
  { id: "design_marketing", label: "Design & Marketing" },
  { id: "operations", label: "Operations" },
  { id: "support_cs", label: "Support & CS" },
  { id: "tech_it", label: "Tech & IT roles" },
  { id: "sales_bd", label: "Sales & Business Development" },
  { id: "people", label: "People" },
  { id: "hr", label: "HR" },
  { id: "finance_legal", label: "Finance & Legal" },
  { id: "executive", label: "Executive & Leadership" },
]

interface RolePreferencesProps {
  selectedRoles: string[]
  onChange: (roles: string[]) => void
  readOnly?: boolean
}

export function RolePreferences({ selectedRoles, onChange, readOnly = false }: RolePreferencesProps) {
  const { toast } = useToast()
  const [roles, setRoles] = useState<string[]>(selectedRoles)

  const handleRoleToggle = (roleId: string) => {
    if (readOnly) return

    const updatedRoles = roles.includes(roleId) ? roles.filter((id) => id !== roleId) : [...roles, roleId]

    setRoles(updatedRoles)
    onChange(updatedRoles)
  }

  const handleSave = () => {
    onChange(roles)
    toast({
      title: "Preferences saved",
      description: "Your role preferences have been updated.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Preferences</CardTitle>
        <CardDescription>
          {readOnly
            ? "Roles this HR professional specializes in or prefers to work with"
            : "Select the roles you specialize in or prefer to work with"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roleCategories.map((role) => (
            <div key={role.id} className="flex items-center space-x-2">
              <Checkbox
                id={`role-${role.id}`}
                checked={roles.includes(role.id)}
                onCheckedChange={() => handleRoleToggle(role.id)}
                disabled={readOnly}
              />
              <Label
                htmlFor={`role-${role.id}`}
                className={`${readOnly && !roles.includes(role.id) ? "text-gray-400" : ""}`}
              >
                {role.label}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
      {!readOnly && (
        <CardFooter>
          <Button onClick={handleSave} className="ml-auto">
            Save Preferences
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
