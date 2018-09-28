UPDATE
    combinations
SET
    p_id = (SELECT P.id FROM
    stock_availables S
	JOIN productos P ON P.id = S.id_product AND S.id_product_attribute > 0
	where S.id_product_attribute = combinations.product_id)


  SELECT *
  from productos P
  join producto_colores PC on P.id = PC.p_id
  join colores C ON PC.option_id = C.id

CREATE TABLE `colores` ( `id` , `color` , `name` )

CREATE TABLE "producto_colores" ( `p_id` INTEGER, `option_id` INTEGER, `upc` TEXT )

select nombre, p_u, count(p_u) num_ventas from ventas_productos VP
where tipo = 'R'
group by p_u
order by num_ventas desc

SELECT VP.id, VP.nombre, VP.cantidad, VP.P_U, V.fecha FROM ventas_productos VP
JOIN ventas V ON V.id = VP.venta_id
ORDER BY V.fecha DESC

select nombre, p_u, sum(cantidad) cant
from ventas_productos
where tipo = 'A'
group by nombre, p_u
order by cant desc
