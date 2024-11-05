export interface Pedido {
   idPedido: number;
   idCliente: number;
   modalidad: string;
   montoTotal: number;
   estado: string;
   hamburguesas?: { 
      idHamburguesa: number; 
      nombre: string; 
      cantidad: number;  
   }[];
}
