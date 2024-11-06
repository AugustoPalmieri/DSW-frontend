export interface Pedido {
   idPedido?: number; //puede ser ?
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
