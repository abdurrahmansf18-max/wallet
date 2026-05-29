import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function UpcomingBillsTab({ bills, formatDate, getDaysUntilDue, getStatusColor }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Bills</CardTitle>
        <CardDescription>Bills that are due soon or overdue</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bills.map((bill) => {
                const daysUntil = getDaysUntilDue(bill.dueDate)
                const statusColor = getStatusColor(daysUntil)

                return (
                  <TableRow key={bill.id}>
                    <TableCell className="font-medium">{bill.name}</TableCell>
                    <TableCell>${bill.amount.toFixed(2)}</TableCell>
                    <TableCell>{formatDate(bill.dueDate)}</TableCell>
                    <TableCell>
                      <Badge variant={statusColor}>
                        {daysUntil < 0 ? "Overdue" : daysUntil === 0 ? "Due Today" : `Due in ${daysUntil} days`}
                      </Badge>
                    </TableCell>
                    <TableCell>{bill.category}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm">
                        <Link href={`/bills/pay?id=${bill.id}`}>Pay Now</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
