import React, { useEffect, useMemo, useState } from 'react';
import { useTable, useSortBy } from 'react-table';
import apiCall from "../helpers/apiCall";
import {Button, Col, Container, FormGroup, Input, Label, Table} from "reactstrap";

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
            Header: 'Volume Change',
            accessor: `volume_change_${index}`,
            sortDescFirst: true
          },
          {
            Header: 'Price Change',
            accessor: `price_change_${index}`,
            sortDescFirst: true
          },
          {
            Header: 'Average Price',
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
            Header: 'Volume Change',
            accessor: `average_volume_change`,
            sortDescFirst: true
          },
          {
            Header: 'Price Change',
            accessor: 'average_price_change',
            sortDescFirst: true
          },
          {
            Header: 'Average Price',
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

  const syncPriceHistories = () => {
    apiCall.submitEntity({ sector: sector },'/price_histories/sync.json')
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
      <div className="content">
        <Container className="themed-container mb-4" fluid={true} >
          <FormGroup row>
            <Col sm={6}>
              <Input type="select" name="select" id="selectSectors" bsSize="md" onChange={toggleSector}>
                { sectorOptions.map((sector, index) => <option key={String(index)} value={sector.value}>{sector.label}</option> )}
              </Input>
            </Col>
            <Col sm={4}>
              <Button className="primary" onClick={syncPriceHistories}>Sync Sector Price Histories</Button>
            </Col>
          </FormGroup>
        </Container>
        <Container className="themed-container" fluid={true}>
          <Table className="table-bordered" {...getTableProps()} size="xl">
            <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                <th>#</th>
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
        </Container>
      </div>
    </>
  )
}