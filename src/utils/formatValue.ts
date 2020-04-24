const formatValue = (value: number): string =>
  `${value < 0 ? '- ' : ''}R$ ${Intl.NumberFormat('pt-BR').format(
    Math.abs(value),
  )},00`;

export default formatValue;
