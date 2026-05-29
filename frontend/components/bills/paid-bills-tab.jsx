import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Calendar, Receipt } from "lucide-react"

export function PaidBillsTab({ bills, formatDate }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paid Bills</CardTitle>
        <CardDescription>History of your paid bills</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Paid Date</TableHead>
                <TableHead>Payee</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-medium">{bill.name}</TableCell>
                  <TableCell>${bill.amount.toFixed(2)}</TableCell>
                  <TableCell>{formatDate(bill.paidDate)}</TableCell>
                  <TableCell>{bill.payee}</TableCell>
                  <TableCell>{bill.category}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View Receipt
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          <Calendar className="mr-2 h-4 w-4" />
          Filter by Date
        </Button>
        <Button variant="outline" size="sm">
          <Receipt className="mr-2 h-4 w-4" />
          Export Bills
        </Button>
      </CardFooter>
    </Card>
  )
}
