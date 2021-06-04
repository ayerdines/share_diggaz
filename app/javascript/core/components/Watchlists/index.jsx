import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, CardHeader, Col, Container, Row } from "reactstrap";
import ReactTable from '../ReactTable';
import apiCall from "../../helpers/apiCall";
import moment from 'moment';
import SweetAlert from 'react-bootstrap-sweetalert';

export default function Index({ history }) {
  const [watchlistsData, setWatchlistsData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    apiCall.fetchEntities('/watchlists.json')
      .then((response) => {
        const { data, meta } = response.data;
        const watchlistData = data.map((datum) => datum.attributes).map((attr) => {
          attr.close_price = (meta.close_prices.find((r) => r.symbol === attr.symbol) || {}).close_price
          return attr
        });
        setWatchlistsData(watchlistData);
      }).catch(() => {});
    categoryOptions();
  }, [])

  const categoryOptions = () => {
    apiCall.fetchEntities('/watchlists/categories.json')
      .then((response) => {
        setCategories(response.data);
      })
  };

  const deleteWatchlist = (id) => {
    apiCall.deleteEntity(`/watchlists/${id}`)
      .then(() => {
        const watchlistData = watchlistsData.filter((w) => w.id !== id);
        setAlert(null);
        setWatchlistsData(watchlistData);
      }).catch(() => {});
  }

  const deleteWithWarning = (id) => {
    setAlert(<SweetAlert
      warning
      showCancel
      confirmBtnText="Yes, delete it!"
      confirmBtnBsStyle="danger"
      title="Are you sure?"
      onConfirm={() => {deleteWatchlist(id)}}
      onCancel={() => setAlert(null)}
      focusCancelBtn
    />);
  }

  const tableData = useMemo(() => watchlistsData, [watchlistsData]);
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
        accessor: 'business_date',
        Cell: ({ value }) =>  moment(value).format('YYYY-MM-DD')
      },
      {
        Header: 'Category',
        accessor: 'category',
        Cell: ({ value }) => {
          if (categories.find((c) => c.value === value)) {
            return categories.find((c) => c.value === value).label
          }
          return null
        }
      },
      {
        Header: 'Remarks',
        accessor: 'remarks'
      },
      {
        Header: 'Previous Closing Price',
        accessor: 'close_price'
      },
      {
        Header: 'Gain',
        Cell: ({ row }) => {
          if (row.original.close_price && row.original.price && row.original.quantity) {
            const percent = (row.original.close_price - row.original.price)/row.original.price;
            const amount = (row.original.close_price - row.original.price) * row.original.quantity;
            return `${amount} (${percent}%)`
          }
          return null;
        }
      },
      {
        Header: 'Actions',
        Cell: ({ row }) => {
          return (
            <>
              <div className="actions-right">
                <Button
                  onClick={() => {
                    history.push(`/admin/watchlists/${row.original.id}/edit`);
                  }}
                  color="primary"
                  className="btn-icon"
                  size="sm"
                >
                  <i className="ni ni-ruler-pencil" />
                </Button>
                <Button
                  onClick={() => deleteWithWarning(row.original.id)}
                  color="warning"
                  size="sm"
                  className="btn-icon"
                >
                  <i className="ni ni-fat-remove" />
                </Button>
              </div>
            </>
          )}
      }
    ], [watchlistsData]
  )

  return (
    <>
      <Container className="mt--9 mb-5" fluid>
        { alert }
        <Row>
          <Col xs={12}>
            <Button color="primary" type="button" onClick={() => history.push('/admin/watchlists/new')}>
              Add Stock
            </Button>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Watchlists</h3>
              </CardHeader>
              <ReactTable data={tableData} columns={columns} />
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}