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
