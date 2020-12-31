import { TableBody, TableCell, TableRow } from "@material-ui/core";
const TableBodyTS = ({children, data, message}) => {
    if(data?.length > 0) {
        return (
            <TableBody>
                {children}
            </TableBody>
        )
    }
    return (
        <TableBody>
            <TableRow>
                <TableCell colSpan={3} align="left">{message}</TableCell>
            </TableRow>
        </TableBody>
    )
}

export default TableBodyTS;