import React from 'react';


export default function Card({ children, className = '', onClick }) {
return (
<div className={`bg-white rounded-lg shadow-md p-6 ${onClick ? 'cursor-pointer' : ''} ${className}`} onClick={onClick}>
{children}
</div>
);
}