import React, {useEffect, useMemo, useState} from "react";
import AsyncSelect from 'react-select/async';
import ReactTable from '../ReactTable';
import {Button, Card, CardHeader, Col, Container, Row} from "reactstrap";
import apiCall from "../../helpers/apiCall";
import adminCanAccess from "../../helpers/Authorization";


export default function Index({ history }) {
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
        Header: 'Net Interest Income',
        accessor: 'net_interest_income',
      },
      {
        Header: 'Share Outstanding',
        accessor: 'shares_outstanding',
      },
      {
        Header: 'Net Profit',
        accessor: 'net_profit',
      },
      {
        Header: 'EPS',
        accessor: 'eps',
      },
      {
        Header: 'Book Value',
        accessor: 'book_value',
      },
      {
        Header: 'ROE',
        accessor: 'roe',
      },
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