
import { Content, Header, SideBar } from '../../shared/components'

import OrdersList from './orderslist'

const Orders = () => {
  return (
    <div className="flex flex-col h-screen w-screen">
    <Header title='Pedidos'/>
    <div className="flex flex-row flex-grow">
      <SideBar />
      <Content content={<OrdersList />} />
    </div>
  </div>
  )
}

export default Orders
