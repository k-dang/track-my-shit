import './Number.css';

const Number = ({ number, neutral, isPercent, isSmall }) => {
  if (neutral || number === 0) {
    return <div>{number}</div>;
  }
  const isPositive = number > 0;
  const symbol = isPositive ? '+' : '-';

  return (
    <div
      className={`${isPositive ? 'profit' : 'loss'} ${isSmall ? 'accent' : ''}`}
    >
      {symbol + number + (isPercent ? '%' : '')}
    </div>
  );
};

Number.defaultProps = { neutral: true, isPercent: false, isSmall: false };

export default Number;
