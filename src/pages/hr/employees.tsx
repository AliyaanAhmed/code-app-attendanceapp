import { useMemo, useState } from "react"
import { UserCog2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageTransition } from "@/components/app/page-transition"
import { useHrStore } from "@/store/hrStore"
import type { Role } from "@/data/mockData"

const roles: Role[] = ["Employee", "Lead", "Director", "Finance Manager", "HR Manager"]

export default function HrEmployeesPage() {
  const employees = useHrStore((state) => state.employees)
  const setActive = useHrStore((state) => state.setEmployeeActiveState)
  const [search, setSearch] = useState("")

  const rows = useMemo(
    () =>
      employees.filter((employee) => {
        const key = `${employee.name} ${employee.department} ${employee.role}`.toLowerCase()
        return key.includes(search.toLowerCase())
      }),
    [employees, search]
  )

  return (
    <PageTransition>
      <Card className="border-[#F56B1F]/20 bg-[linear-gradient(120deg,#fff,#fff4ed)]">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2"><UserCog2 className="text-[#F56B1F]" /> Employee Lifecycle Management</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Employee Registry</CardTitle>
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search employee..." />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role Assignment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant={employee.isActive === false ? "outline" : "default"}
                      className={employee.isActive === false ? "" : "bg-emerald-600 hover:bg-emerald-700"}
                      onClick={() => setActive(employee.id, employee.isActive === false)}
                    >
                      {employee.isActive === false ? "Inactive" : "Active"}
                    </Button>
                  </TableCell>
                  <TableCell>{employee.contact}</TableCell>
                  <TableCell>
                    <Select defaultValue={employee.role}>
                      <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageTransition>
  )
}

