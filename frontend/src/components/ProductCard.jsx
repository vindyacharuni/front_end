export default function ProductCard(props) {
    const product = props.product
    return (
        <div className='w-[300px] h-[400px] bg-white rounded-lg shadow-2xl shrink-0 overflow-hidden flex flex-col items-center'>
            { <img src={product.images[0]} className='w-full h-[300px] object-cover'/> }
            <div
                className='w-full h-[100px] flex flex-col items-center justify-center gap-20px p-6'>
                    <span
                    className='text-gray-400'>

                        {product.productId}
                    </span>
                    <h1 className='text-xl font-semibold'>{product.name}{" "}<span className='text-gray-400 text-sm'>{product.category} </span></h1>
                    <span>
                        {
                            product.labelledPrice > product.price ? (
                                <span>
                                    Discounted Price: <span className='line-through text-gray-400'>{product.labelledPrice?.toLocaleString?.(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? ''}</span>{' '}
                                    <span className='text-green-500 font-bold'>{product.price?.toLocaleString?.(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? ''}</span>
                                </span>
                            ) : (
                                <span>Price: <span className='text-green-500 font-bold'>{product.price?.toLocaleString?.(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? ''}</span></span>
                            )
                        }

                    </span>
                    



            </div>
        </div>
    )
}