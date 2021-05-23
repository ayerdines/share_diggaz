import React, { useEffect, useMemo, useState } from 'react';
import { useTable, useSortBy } from 'react-table';
import apiCall from "../helpers/apiCall";
import {Button, Card, CardHeader, Col, Container, Input, Row, Table} from "reactstrap";
import Header from "./Headers/Header";

export default function PriceHistories() {
  const [priceHistories, setPriceHistories] = useState([]);
  const [businessDates, setBusinessDates] = useState([]);
  const [sectorOptions, setSectorOptions] = useState([]);
  const [sector, setSector] = useState('commercial_banks');

  useEffect(() => {
    fetchPriceHistories();
    fetchSectorOptions();
  }, [sector])

  const fetchPriceHistories = () => {
    apiCall.fetchEntities('/price_histories.json', {sector: sector})
      .then((response) => {
        const { data, meta } = response.data;
        const prices = data.map((datum) => datum.attributes);
        const priceHistoriesData = groupByBusinessDate(prices);
        setBusinessDates(meta.last_3_business_dates);
        setPriceHistories(priceHistoriesData);
      }).catch(() => {});
  }

  const fetchSectorOptions = () => {
    apiCall.fetchEntities('/companies/sector_options.json')
      .then((response) => {
        const { data } = response;
        setSectorOptions(data);
      }).catch(() => {});
  }

  const groupByBusinessDate = (data) => {
    let groupedData = {};
    let formattedPrices = []
    data.map((row) => {
      groupedData[row.symbol] = data.filter((rowNew) => rowNew.symbol === row.symbol);
    })
    Object.entries(groupedData).forEach(([symbol, prices]) => {
      let formattedPrice = {}
      formattedPrice.symbol = symbol;
      prices.reverse().map((price, index) => {
        formattedPrice[`price_change_${index}`] = parseFloat(price.price_change) || 0
        formattedPrice[`volume_change_${index}`] = parseFloat(price.volume_change) || 0
        formattedPrice[`average_traded_price_${index}`] = parseFloat(price.average_traded_price) || 0
      })
      formattedPrice['average_price_change'] = (() => {
        return ((formattedPrice['price_change_0'] + formattedPrice['price_change_1'] + formattedPrice['price_change_2'])/3).toFixed(2)
      })();
      formattedPrice['average_volume_change'] = (() => {
        return ((formattedPrice['volume_change_0'] + formattedPrice['volume_change_1'] + formattedPrice['volume_change_2'])/3).toFixed(2)
      })();
      formattedPrice['average_traded_price'] = (() => {
        return ((formattedPrice['average_traded_price_0'] + formattedPrice['average_traded_price_1'] + formattedPrice['average_traded_price_2'])/3).toFixed(2)
      })();
      formattedPrices.push(formattedPrice);
    });
    return formattedPrices;
  }

  const dynamicColumns = () => {
    return businessDates.reverse().map((businessDate, index) => {
      let date = businessDate.business_date;
      return {
        Header: `Business Day (${date.split('T')[0]})`,
        columns: [
          {
            Header: 'VC',
            accessor: `volume_change_${index}`,
            sortDescFirst: true
          },
          {
            Header: 'PC',
            accessor: `price_change_${index}`,
            sortDescFirst: true
          },
          {
            Header: 'AP',
            accessor: `average_traded_price_${index}`,
            sortDescFirst: true
          }],
      }
    })
  }

  const columns = useMemo(
    () => [
      {
        Header: 'Symbol',
        accessor: 'symbol',
      },
      ...dynamicColumns(),
      {
        Header: 'Average',
        columns: [
          {
            Header: 'VC',
            accessor: `average_volume_change`,
            sortDescFirst: true
          },
          {
            Header: 'PC',
            accessor: 'average_price_change',
            sortDescFirst: true
          },
          {
            Header: 'AP',
            accessor: 'average_traded_price',
            sortDescFirst: true
          }],
      },
    ],
    [businessDates]
  )

  const toggleSector = (event) => {
    setSector(event.target.value);
  }

  const syncLastDay = () => {
    syncPriceHistories(true);
  }

  const syncAll = () => {
    syncPriceHistories();
  }

  const syncPriceHistories = (lastDay = false) => {
    apiCall.submitEntity({ sector: sector, last_day: lastDay },'/price_histories/sync.json')
      .then((response) => {
        alert('Sync Started');
      }).catch(() => {});
  }

  const data = useMemo(() => priceHistories, [priceHistories]);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({columns, data, initialState: { pageIndex: 0, pageSize: 20 }}, useSortBy)

  return (
    <>
      <Container className="pb-8 pt-5 pt-md-8" fluid>
        <Row>
          <Col md={3}>
            <Input type="select" bsSize="md" onChange={toggleSector}>
              { sectorOptions.map((sector, index) => <option key={String(index)} value={sector.value}>{sector.label}</option> )}
            </Input>
          </Col>
          <Col md={9}>
            <Button color="primary" type="button" onClick={syncAll}>
              Sync Sector Price Histories
            </Button>
            <Button color="primary" type="button" onClick={syncLastDay}>
              Sync Last Trading Day
            </Button>
          </Col>
          <Col>
            <Row className="mt-5">
              <Col>
                <Card className="shadow">
                  <CardHeader className="border-0">
                    <h3 className="mb-0">Price Histories</h3>
                  </CardHeader>
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
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  )
}