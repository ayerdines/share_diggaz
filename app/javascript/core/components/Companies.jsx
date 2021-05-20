import React, { useEffect, useMemo, useState } from 'react';
import { useTable, useFilters, useSortBy, usePagination } from 'react-table';
import apiCall from "../helpers/apiCall";
import { Button, Container, Table } from "reactstrap";

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [lastSynced, setLastSynced] = useState('');

  useEffect(() => {
    apiCall.fetchEntities('/companies.json')
      .then((response) => {
        const { data } = response.data;
        const companiesData = data.map((datum) => datum.attributes);
        if (companiesData.length) {
          setLastSynced(companiesData[0].updated_at);
        }
        setCompanies(companiesData);
      }).catch(() => {});
  }, [])


  const syncCompanies = () => {
    apiCall.submitEntity({},'/companies/sync.json')
      .then((response) => {
        alert('Sync Started');
      }).catch(() => {});
  }

  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'nepse_company_id',
      },
      {
        Header: 'Security Name',
        accessor: 'security_name',
      },
      {
        Header: 'Symbol',
        accessor: 'symbol',
      },
      {
        Header: 'Sector',
        accessor: 'sector',
      },
    ],
    []
  )
  const data = useMemo(() => companies, [companies]);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable({columns, data, initialState: { pageIndex: 0, pageSize: 20 }}, useFilters, useSortBy, usePagination)

  return (
    <>
      <div className="content">
        <Container className="themed-container mb-4" fluid={true}>
          <Button className="primary" onClick={syncCompanies} disabled>Sync Companies</Button>
          {' '}
          Last Synced on: { lastSynced ? lastSynced : 'Never synced'}
        </Container>
        <Container className="themed-container" fluid={true}>
          <Table className="table-bordered" {...getTableProps()} size="xl">
            <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps()}
                  >
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {page.map(row => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
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
        </Container>
        <Container>
          <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
          </Button>{' '}
          <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
          </Button>{' '}
          <Button onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
          </Button>{' '}
          <Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
          </Button>{' '}
          <span>
            Page{' '}
            <strong>
            {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </span>
          <span>
          | Go to page:{' '}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                gotoPage(page)
              }}
              style={{ width: '100px' }}
            />
          </span>{' '}
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value))
            }}
          >
            {[10, 20, 30, 40, 50, 100, 200, 300, 400].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </Container>
      </div>
    </>
  )
}