import React, { Component } from 'react';
import { Template } from '../../components';
import OrderForm from '../order-form/orderForm'
import { SERVER_IP } from '../../private';
import { connect } from 'react-redux';
import './viewOrders.css';

const ADD_ORDER_URL = `${SERVER_IP}/api/add-order`;
const DELETE_ORDER_URL = `${SERVER_IP}/api/delete-order`;
const EDIT_ORDER_URL = `${SERVER_IP}/api/edit-order`;

class ViewOrders extends Component {
	state = {
		orders: [],
		order: {},
		isEdit: false,
	}

	fetchData = async() => {
		try {
			const response = await fetch(`${SERVER_IP}/api/current-orders`);
			const json = await response.json();
			if(json.success) {
				this.setState({ orders: json.orders });
      } else {
				console.log('Error getting orders');
			}
		} catch (error) {
			console.log('Error: ', error);
		}
	}

  componentDidMount = () => {
		this.fetchData();
  }

  menuItemChosen = event => {
    this.setState({ 
			order : {
				...this.state.order,
				order_item : event.target.value
			} 
		});
  }

  menuQuantityChosen = event => {
    this.setState({ 
			order : {
				...this.state.order,
				quantity : event.target.value
			} 
		});
	}
		
	toggleEditMode = event => {
		this.setState({ isEdit: true });
		const filteredOrder = this.state.orders.filter(order => order._id === event.target.value)[0];
		const { order_item, quantity, _id } = filteredOrder;
		this.setState({
			order : {
				order_item,
				quantity,
				_id
			}
		})
	}

  submitOrder = async(event) => {
		if(!this.state.isEdit) {
			const { order_item, quantity } = this.state.order
    	event.preventDefault();
			if (order_item === "") return;
			try {
				const response = await fetch(ADD_ORDER_URL, {
					method: 'POST',
					body: JSON.stringify({
						order_item: order_item,
						quantity: quantity,
						ordered_by: this.props.auth.email || 'Unknown!',
					}),
					headers: {
						'Content-Type': 'application/json'
					}
				});
				const json = await response.json();
				if(json.success) {
					this.setState({ isEdit: false });
					this.fetchData()
				} else {
					console.log('error posting orders')
				}
			} catch (error) {
				console.log('Error: ', error);
			}
    
		} else {
				const { order_item, quantity, _id } = this.state.order;
				try {
					const response = await fetch(EDIT_ORDER_URL, {
						method: 'POST',
						body: JSON.stringify({
							id: _id,
							order_item: order_item,
							quantity: quantity,
							ordered_by: this.props.auth.email || 'Unknown!',
						}),
						headers: {
							'Content-Type': 'application/json'
						}
					});
					const json = await response.json();
					if(json.success) {
						this.setState({ isEdit: false });
						this.fetchData();
					} else {
						console.log('error posting orders')
					}
				} catch (error) {
					console.log('Error: ', error);
				}				
		 }				
  }

  handleDelete = async(e) => {
		let id = e.target.value;
		try {
			const response = await fetch(DELETE_ORDER_URL, {
				method: 'POST',
				body: JSON.stringify({ id }),
				headers: {
					'Content-Type': 'application/json',
					}       
				});
			const json = await response.json();
			if(json.success) {
				this.fetchData();
			} else {
				console.log('error deleting order')
			}
		} catch(error) {
			console.log('Error: ', error);
		}
	}

  render() {
		const { isEdit, order, orders } = this.state 
    if(isEdit) return (
			<OrderForm
				order_item={order.order_item}
				quantity={order.quantity}
				_id={order._id}
				menuItemChosen={this.menuItemChosen}
				menuQuantityChosen={this.menuQuantityChosen}
				submitOrder={this.submitOrder}
				isEdit={isEdit}
      />
    )
    return (
			<Template>
        <div className="container-fluid">
        {orders.map(order => {
          const createdDate = new Date(order.createdAt);
          return (
            <div className="row view-order-container" key={order._id}>
              <div className="col-md-4 view-order-left-col p-3">
                <h2>{order.order_item}</h2>
                <p>Ordered by: {order.ordered_by || ''}</p>
              </div>
              <div className="col-md-4 d-flex view-order-middle-col">
                <p>Order placed at {`${createdDate.getHours()}:${createdDate.getMinutes()}:${createdDate.getSeconds()}`}</p>
                <p>Quantity: {order.quantity}</p>
              </div>
              <div className="col-md-4 view-order-right-col">
                <button className="btn btn-success" value={order._id} onClick={this.toggleEditMode}>Edit</button>
                <button className="btn btn-danger" value={order._id} onClick={this.handleDelete}>Delete</button>
              </div>
            </div>
          );
        })}
        </div>
      </Template>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
	auth
})

export default connect(mapStateToProps, null)(ViewOrders);
