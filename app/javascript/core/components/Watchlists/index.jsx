import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, CardHeader, Col, Container, Row } from "reactstrap";
import ReactTable from '../ReactTable';
import apiCall from "../../helpers/apiCall";
import { useSortBy, useTable } from "react-table";


export default function Index({ history }) {
  const [watchlists, setWatchlists] = useState([]);

  useEffect(() => {
    fetchWatchlists();
  }, [])

  const fetchWatchlists = () => {
    apiCall.fetchEntities('/watchlists.json')
      .then((response) => {
        const { data, meta } = response.data;
        const watchlistData = data.map((datum) => datum.attributes);
        setWatchlists(watchlistData);
      }).catch(() => {});
  }

  const data = useMemo(() => watchlists, [watchlists]);
  const columns = useMemo(
    () => [
      {
        Header: 'Symbol',
        accessor: 'symbol'
      },
      {
        Header: 'Quantity',
        accessor: 'quantity'
      },
      {
        Header: 'Price',
        accessor: 'price'
      },
      {
        Header: 'Business Date',
        accessor: 'business_date'
      },
      {
        Header: 'Category',
        accessor: 'category'
      },
      {
        Header: 'Previous Closing Price',
        accessor: 'close_price'
      },
      {
        Header: 'Gain',
        Cell: ({ row }) => {
          if (row.original.close_price && row.original.price && row.original.quantity) {
            return (row.original.close_price - row.original.price) * row.original.quantity
          }
          return null;
        }
      },
      {
        Header: 'Actions',
        Cell: ({ row }) => {
          return null;
        }
      }
    ], []
  )

  return (
    <>
      <Container className="pb-8 pt-5 pt-md-8" fluid>
        <Row>
          <Col xs={12}>
            <Button color="primary" type="button" onClick={() => history.push('/admin/watchlist/new')}>
              Add Stock
            </Button>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Watchlist</h3>
              </CardHeader>
              <ReactTable data={data} columns={columns} />
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}