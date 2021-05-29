import React from "react";
import { Table } from "reactstrap";
import { useSortBy, useTable } from "react-table";

export default function Index({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({columns, data, initialState: { pageIndex: 0, pageSize: 20 }, defaultCanSort: true}, useSortBy)

  return (
    <Table className="align-items-center table-flush" responsive {...getTableProps()}>
      <thead>
      {headerGroups.map(headerGroup => (
        <tr {...headerGroup.getHeaderGroupProps()}>
          <th />
          {headerGroup.headers.map(column => (
            <th
              {...column.getHeaderProps(column.getSortByToggleProps())}
            >
              {column.render('Header')}
              <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? ' 🔽'
                            : ' 🔼'
                          : ''}
                      </span>
            </th>
          ))}
        </tr>
      ))}
      </thead>
      <tbody {...getTableBodyProps()}>
      {rows.map((row, i) => {
        prepareRow(row)
        return (
          <tr {...row.getRowProps()}>
            <td>{String(i + 1)}</td>
            {row.cells.map(cell => {
              return (
                <td
                  {...cell.getCellProps()}
                >
                  {cell.render('Cell')}
                </td>
              )
            })}
          </tr>
        )
      })}
      </tbody>
    </Table>
  )
}