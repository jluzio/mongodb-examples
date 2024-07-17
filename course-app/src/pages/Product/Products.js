import React, { Component } from 'react';
import querystring from 'querystring';
import axios from 'axios';

import Products from '../../components/Products/Products';

class ProductsPage extends Component {
  state = { isLoading: true, products: [] };
  componentDidMount() {
    this.fetchData()
  }

  fetchData() {
    /** @type {String} */
    const search = this.props.location.search || ''
    const qs = querystring.parse(search.replace('?', ''))
    console.log({search, qs})
    const svcQuery = qs.page !== undefined ? `?page=${qs.page}&pageSize=${qs.pageSize}` : ''
    return axios
      .get('http://localhost:3100/products' + svcQuery)
      .then(productsResponse => {
        this.setState({ isLoading: false, products: productsResponse.data });
      })
      .catch(err => {
        this.setState({ isLoading: false, products: [] });
        this.props.onError('Loading products failed. Please try again later');
        console.log(err);
      });
  }

  productDeleteHandler = productId => {
    axios
      .delete('http://localhost:3100/products/' + productId)
      .then(result => {
        console.log(result);
        return this.fetchData()
      })
      .catch(err => {
        this.props.onError(
          'Deleting the product failed. Please try again later'
        );
        console.log(err);
      });
  };

  render() {
    let content = <p>Loading products...</p>;

    if (!this.state.isLoading && this.state.products.length > 0) {
      content = (
        <Products
          products={this.state.products}
          onDeleteProduct={this.productDeleteHandler}
        />
      );
    }
    if (!this.state.isLoading && this.state.products.length === 0) {
      content = <p>Found no products. Try again later.</p>;
    }
    return <main>{content}</main>;
  }
}

export default ProductsPage;
