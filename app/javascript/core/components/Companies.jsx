import React, { useEffect, useMemo, useState } from 'react';
import { useTable, useFilters, useSortBy, usePagination } from 'react-table';
import apiCall from "../helpers/apiCall";
import {
  Button,
  Card, CardBody,
  CardHeader, CardTitle,
  Col,
  Container,
  Input,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Table
} from "reactstrap";

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
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable({columns, data, initialState: { pageIndex: 0, pageSize: 20 }}, useFilters, useSortBy, usePagination)

  return (
    <>
      <Container className="pb-8 pt-5 pt-md-8" fluid>
        <Row>
          <Col xs={12}>
            <Button color="primary" type="button" onClick={syncCompanies}>
              Sync Companies
            </Button>
            { ' ' }
            Last Synced on: { lastSynced ? lastSynced : 'Never synced'}
          </Col>
        </Row>
        <Row className="mt-5">
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Companies</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" {...getTableProps()}>
                <thead>
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
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
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}