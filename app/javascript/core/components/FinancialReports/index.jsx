import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from 'react-router-dom';
import AsyncSelect from 'react-select/async';
import ReactTable from '../ReactTable';
import { Button, Card, CardHeader, Col, Container, Row } from "reactstrap";
import apiCall from "../../helpers/apiCall";
import adminCanAccess from "../../helpers/Authorization";


export default function Index({ history, match }) {
  const query = useQuery();
  const [symbol, setSymbol] = useState('');
  const [financialReports, setFinancialReports] = useState([]);

  useEffect(() => {
    apiCall.fetchEntities('/financial_reports.json', { symbol: symbol })
      .then((response) => {
        const { data } = response.data;
        const financialReportsData = data.map((datum) => datum.attributes);
        setFinancialReports(financialReportsData);
      }).catch(() => {});
  }, [symbol])

  useEffect(() => {
    if (query.get("symbol")) {
      setSymbol(query.get("symbol"))
    }
  }, [])

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  const loadOptions = (inputValue, callback) => {
    apiCall.fetchEntities('/companies/symbol_options', { term: inputValue })
      .then((response) => {
        callback(response.data.map((company) => {
          return { label: `${company.security_name}(${company.symbol})`, value: company.symbol }
        }));
      })
  };

  const syncIndividualFinancialReport = () => {
    if (symbol) {
      apiCall.submitEntity({ symbol: symbol },'/financial_reports/sync.json')
        .then((response) => {
          alert('Sync Started');
        }).catch(() => {});
    }
  }

  const data = useMemo(() => financialReports, [financialReports]);
  const columns = useMemo(
    () => [
      {
        Header: 'Year',
        accessor: 'year',
      },
      {
        Header: 'Quarter',
        accessor: 'quarter',
      },
      {
        Header: 'Share Outstanding',
        accessor: 'shares_outstanding',
        Cell: ({ value }) => {
          if (value) return new Intl.NumberFormat('en-IN').format(value);
          return null;
        }
      },
      {
        Header: 'Net Interest Income',
        accessor: 'net_interest_income',
        Cell: ({ value }) => {
          if (value) return new Intl.NumberFormat('en-IN').format(value);
          return null;
        }
      },
      {
        Header: 'Net Profit',
        accessor: 'net_profit',
        Cell: ({ value }) => {
          if (value) return new Intl.NumberFormat('en-IN').format(value);
          return null;
        }
      },
      {
        Header: 'Distributable Profit',
        accessor: 'distributable_profit',
        Cell: ({ value }) => {
          if (value) return new Intl.NumberFormat('en-IN').format(value);
          return null;
        }
      },
      {
        Header: 'EPS',
        accessor: 'eps',
      },
      {
        Header: 'Book Value',
        accessor: 'book_value',
        Cell: ({ value }) => {
          if (value) return new Intl.NumberFormat('en-IN').format(value);
          return null;
        }
      },
      {
        Header: 'ROE (%)',
        accessor: 'roe',
      },
      {
        Header: 'Actions',
        Cell: ({ row }) => {
          return (
            <>
              <div className="actions-right">
                <Button
                  onClick={() => {
                    history.push(`/admin/financial-reports/${row.original.id}/edit`);
                  }}
                  color="primary"
                  className="btn-icon"
                  size="sm"
                >
                  <i className="ni ni-ruler-pencil" />
                </Button>
              </div>
            </>
          )}
      }
    ],
    []
  )

  return (
    <>
      <Container className="mt--9 mb-5" fluid>
        <Row>
          <Col md={3}>
            <AsyncSelect onChange={(option) => setSymbol(option.value)} loadOptions={loadOptions} />
          </Col>
          <Col md={9}>
            <Button color="primary" type="button" onClick={() => history.push('/admin/financial-reports/new')}>
              Add Report
            </Button>
            { adminCanAccess() && (
              <Button color="primary" type="button" onClick={syncIndividualFinancialReport}>
                Sync Financial Report
              </Button>
            )}
          </Col>
        </Row>
        <Row className="mt-5">
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Financial Reports</h3>
              </CardHeader>
              <ReactTable data={data} columns={columns} />
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}