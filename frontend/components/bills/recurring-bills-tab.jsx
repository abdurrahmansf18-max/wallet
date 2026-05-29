import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Clock, Plus } from "lucide-react"

export function RecurringBillsTab({ bills, formatDate }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recurring Bills</CardTitle>
        <CardDescription>Bills that are automatically charged on a schedule</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Next Payment</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-medium">{bill.name}</TableCell>
                  <TableCell>${bill.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      {bill.frequency}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(bill.nextDate)}</TableCell>
                  <TableCell>{bill.category}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Recurring Bill
        </Button>
      </CardFooter>
    </Card>
  )
}
