import { tableCellClasses, styled, TableCell } from "@mui/material"

const TableCellStyled = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 15
    },
}))

export const StyledTableCell = ({ children }) => {
    return (
        <TableCellStyled>{children}</TableCellStyled>
    )
}

