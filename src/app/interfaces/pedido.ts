export interface Pedido {
   fechaPedido?: Date; 
   idPedido?: number; 
   idCliente: number;
   modalidad: string;
   montoTotal: number;
   estado: string;
   hamburguesas: {  //puede ser sin ?
      idHamburguesa: number; 
      nombre: string; 
      cantidad: number; 
   }[];
}
