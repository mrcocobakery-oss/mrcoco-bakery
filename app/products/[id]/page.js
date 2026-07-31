'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, ShoppingCart, Heart, Star, Truck, Shield, Clock, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Header } from '@/components/navigation/Header'
import { WhatsAppChatButton } from '@/components/WhatsAppChatButton'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id
  
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load cart and wishlist from localStorage
    const savedCart = localStorage.getItem('cart')
    const savedWishlist = localStorage.getItem('wishlist')
    if (savedCart) setCart(JSON.parse(savedCart))
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist))

    // Fetch product from API
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      
      // Fetch the specific product
      const productResponse = await fetch(`/api/products/${productId}`)
      const productData = await productResponse.json()
      
      if (productData.success && productData.product) {
        setProduct(productData.product)
        
        // Fetch all products to get related ones
        const allProductsResponse = await fetch('/api/products')
        const allProductsData = await allProductsResponse.json()
        
        if (allProductsData.success && allProductsData.products) {
          // Get related products (same category, excluding current)
          const related = allProductsData.products
            .filter(p => p.category === productData.product.category && p.id !== productData.product.id)
            .slice(0, 4)
          setRelatedProducts(related)
        }
      } else {
        setProduct(null)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      setProduct(null)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = () => {
    if (!product) return
    
    const newCart = [...cart]
    for (let i = 0; i < quantity; i++) {
      newCart.push(product)
    }
    
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
    toast.success(`${quantity} item(s) added to cart!`)
  }

  const toggleWishlist = () => {
    if (!product) return
    
    const existingIndex = wishlist.findIndex(item => item.id === product.id)
    let newWishlist = [...wishlist]
    
    if (existingIndex > -1) {
      newWishlist.splice(existingIndex, 1)
      toast.success('Removed from wishlist')
    } else {
      newWishlist.push(product)
      toast.success('Added to wishlist!')
    }
    
    setWishlist(newWishlist)
    localStorage.setItem('wishlist', JSON.stringify(newWishlist))
  }

  const isInWishlist = () => {
    return product && wishlist.some(item => item.id === product.id)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Product not found</h2>
          <Link href="/products">
            <Button className="bg-pink-600 hover:bg-pink-700 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const productImages = product.images || [product.image]

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-pink-600">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-pink-600">Products</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category}`} className="hover:text-pink-600 capitalize">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-pink-900">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div>
            <Card className="border-2 border-pink-200 overflow-hidden mb-4">
              <div className="relative h-96 bg-gray-100">
                <img 
                  src={productImages[selectedImage]} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.discount && (
                  <Badge className="absolute top-4 left-4 bg-red-500 text-white text-lg px-3 py-1">
                    {product.discount}% OFF
                  </Badge>
                )}
              </div>
            </Card>
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`border-2 rounded-lg overflow-hidden ${selectedImage === idx ? 'border-pink-600' : 'border-gray-200'}`}
                  >
                    <img src={img} alt={`Product ${idx + 1}`} className="w-full h-20 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold font-serif text-pink-900 mb-3">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{product.rating}</span>
                <span className="text-gray-500">({product.reviews} reviews)</span>
              </div>
              <Badge variant={product.inStock ? 'default' : 'secondary'} 
                     className={product.inStock ? 'bg-green-100 text-green-800' : ''}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </Badge>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-pink-900">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-400 line-through">₹{product.originalPrice}</span>
                )}
                {product.discount && (
                  <Badge className="bg-green-100 text-green-700">Save {product.discount}%</Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">Inclusive of all taxes</p>
            </div>

            <Separator className="my-6" />

            {/* Cake Details */}
            {product.category === 'cakes' && (
              <div className="space-y-3 mb-6">
                {product.size && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700 w-24">Size:</span>
                    <Badge variant="outline" className="text-pink-900">{product.size}</Badge>
                  </div>
                )}
                {product.flavour && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700 w-24">Flavour:</span>
                    <Badge variant="outline" className="text-pink-900">{product.flavour}</Badge>
                  </div>
                )}
                {product.cakeType && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700 w-24">Type:</span>
                    <Badge variant="outline" className="capitalize">{product.cakeType}</Badge>
                  </div>
                )}
                {product.occasion && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700 w-24">Occasion:</span>
                    <Badge variant="outline" className="capitalize">{product.occasion}</Badge>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <Separator className="my-6" />

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="font-semibold text-gray-700 block mb-2">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-pink-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-pink-50"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 font-semibold border-x-2 border-pink-200">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-pink-50"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* WhatsApp Button for Cakes */}
            {product.category === 'cakes' && (
              <div className="mb-4">
                <WhatsAppChatButton product={product} className="w-full" />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Chat with us on WhatsApp to customize your cake!
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <Button
                onClick={addToCart}
                disabled={!product.inStock}
                className="flex-1 bg-pink-600 hover:bg-pink-700 text-white h-12 text-lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                onClick={toggleWishlist}
                variant="outline"
                className={`h-12 px-6 ${isInWishlist() ? 'border-red-500 text-red-500' : ''}`}
              >
                <Heart className={`w-5 h-5 ${isInWishlist() ? 'fill-red-500' : ''}`} />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-pink-200">
                <CardContent className="p-4 text-center">
                  <Truck className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Free Delivery</p>
                  <p className="text-xs text-gray-500">On orders above ₹500</p>
                </CardContent>
              </Card>
              <Card className="border-pink-200">
                <CardContent className="p-4 text-center">
                  <Shield className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">100% Fresh</p>
                  <p className="text-xs text-gray-500">Quality guaranteed</p>
                </CardContent>
              </Card>
              <Card className="border-pink-200">
                <CardContent className="p-4 text-center">
                  <Clock className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Same Day</p>
                  <p className="text-xs text-gray-500">Delivery available</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold font-serif text-pink-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="group overflow-hidden border-2 border-pink-100 hover:border-pink-400 hover:shadow-xl transition-all">
                  <Link href={`/products/${relatedProduct.id}`}>
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img src={relatedProduct.image} alt={relatedProduct.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      {relatedProduct.discount && (
                        <Badge className="absolute top-2 left-2 bg-red-500 text-white border-0">
                          {relatedProduct.discount}% OFF
                        </Badge>
                      )}
                    </div>
                  </Link>
                  <CardContent className="p-4">
                    <Link href={`/products/${relatedProduct.id}`}>
                      <h3 className="font-semibold text-pink-900 mb-2 hover:text-pink-600 transition line-clamp-2">
                        {relatedProduct.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{relatedProduct.rating}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-pink-900">₹{relatedProduct.price}</span>
                        {relatedProduct.originalPrice && (
                          <span className="text-sm text-gray-400 line-through ml-2">₹{relatedProduct.originalPrice}</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
