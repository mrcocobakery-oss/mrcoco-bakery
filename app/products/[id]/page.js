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

  // Mock products data (same as products page)
  const mockProducts = [
    { id: 1, name: 'Chocolate Truffle Eggless Cake', price: 899, originalPrice: 1099, category: 'cakes', cakeType: 'eggless', occasion: 'birthday', specialDay: '', size: '1kg', flavour: 'Chocolate', image: 'https://images.pexels.com/photos/35583855/pexels-photo-35583855.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', rating: 4.8, reviews: 245, discount: 18, inStock: true, description: 'Rich and decadent chocolate truffle cake made with premium Belgian chocolate. Perfect for birthdays and celebrations.' },
    { id: 2, name: 'Red Velvet Eggless Cake', price: 799, originalPrice: 999, category: 'cakes', cakeType: 'eggless', occasion: 'anniversary', specialDay: '', size: '500g', flavour: 'Red Velvet', image: 'https://images.unsplash.com/photo-1780586377241-41b03171419b', rating: 4.9, reviews: 312, discount: 20, inStock: true, description: 'Classic red velvet cake with smooth cream cheese frosting. A timeless favorite for special occasions.' },
    { id: 3, name: 'White & Gold Designer Cake', price: 1299, originalPrice: 1599, category: 'cakes', cakeType: 'designer', occasion: 'wedding', specialDay: '', size: '2kg', flavour: 'Vanilla', image: 'https://images.unsplash.com/photo-1633062781822-e32867fe7d4a', rating: 5.0, reviews: 156, discount: 19, inStock: true, description: 'Elegant designer cake with white fondant and gold accents. Perfect for weddings and upscale events.' },
    { id: 4, name: 'Floral Designer Cake', price: 1499, originalPrice: 1799, category: 'cakes', cakeType: 'designer', occasion: 'engagement', specialDay: '', size: '1.5kg', flavour: 'Strawberry', image: 'https://images.pexels.com/photos/35583855/pexels-photo-35583855.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', rating: 4.9, reviews: 178, discount: 17, inStock: true, description: 'Beautiful floral designer cake with fresh flowers and delicate decorations. Ideal for engagements.' },
    { id: 5, name: 'Personalized Photo Cake', price: 999, originalPrice: 1199, category: 'cakes', cakeType: 'photo', occasion: 'birthday', specialDay: '', size: '1kg', flavour: 'Vanilla', image: 'https://images.unsplash.com/photo-1780586377241-41b03171419b', rating: 4.8, reviews: 267, discount: 17, inStock: true, description: 'Custom photo cake with edible print. Add your favorite photo to make birthdays extra special.' },
    { id: 6, name: 'Black Forest Cake', price: 749, originalPrice: 899, category: 'cakes', cakeType: 'chocolate', occasion: 'birthday', specialDay: '', size: '1kg', flavour: 'Chocolate', image: 'https://images.pexels.com/photos/35583855/pexels-photo-35583855.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', rating: 4.6, reviews: 198, discount: 17, inStock: true, description: 'Traditional Black Forest cake with layers of chocolate sponge, whipped cream, and cherries.' },
    { id: 7, name: 'Death By Chocolate Cake', price: 999, originalPrice: 1199, category: 'cakes', cakeType: 'chocolate', occasion: 'birthday', specialDay: '', size: '1kg', flavour: 'Rich Chocolate', image: 'https://images.unsplash.com/photo-1633062781822-e32867fe7d4a', rating: 4.9, reviews: 289, discount: 17, inStock: true, description: 'Ultimate chocolate indulgence with multiple layers of chocolate sponge and ganache.' },
    { id: 8, name: "Mother's Day Special Cake", price: 1099, originalPrice: 1299, category: 'cakes', cakeType: 'premium', occasion: '', specialDay: 'mothers day', size: '1kg', flavour: 'Mixed Berry', image: 'https://images.pexels.com/photos/35583855/pexels-photo-35583855.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', rating: 5.0, reviews: 145, discount: 15, inStock: true, description: 'Special cake designed for Mother\'s Day with fresh berries and elegant decorations.' },
    { id: 9, name: 'Valentine Heart Cake', price: 899, originalPrice: 1099, category: 'cakes', cakeType: 'designer', occasion: '', specialDay: 'valentine', size: '1kg', flavour: 'Strawberry', image: 'https://images.unsplash.com/photo-1780586377241-41b03171419b', rating: 4.8, reviews: 321, discount: 18, inStock: true, description: 'Romantic heart-shaped cake perfect for Valentine\'s Day celebrations.' },
    { id: 10, name: 'Diwali Special Cake', price: 1199, originalPrice: 1499, category: 'cakes', cakeType: 'premium', occasion: '', specialDay: 'diwali', size: '1.5kg', flavour: 'Dry Fruit', image: 'https://images.unsplash.com/photo-1633062781822-e32867fe7d4a', rating: 4.9, reviews: 234, discount: 20, inStock: true, description: 'Festive cake with dry fruits and traditional Indian flavors for Diwali.' },
    { id: 11, name: 'Bento Cake Collection', price: 399, originalPrice: 499, category: 'cakes', cakeType: 'bento', occasion: 'birthday', specialDay: '', size: '250g', flavour: 'Assorted', image: 'https://images.pexels.com/photos/35583855/pexels-photo-35583855.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', rating: 4.9, reviews: 298, discount: 20, inStock: true, description: 'Trendy mini bento cakes - perfect individual servings with various flavors.' },
    { id: 12, name: 'Mini Cake Set of 6', price: 599, originalPrice: 749, category: 'cakes', cakeType: 'mini', occasion: '', specialDay: '', size: '150g each', flavour: 'Mixed', image: 'https://images.unsplash.com/photo-1780586377241-41b03171419b', rating: 4.7, reviews: 187, discount: 20, inStock: true, description: 'Assorted mini cakes in 6 different flavors. Great for parties and sampling.' },
    { id: 13, name: 'Premium Butter Cookies', price: 399, originalPrice: 499, category: 'cookies', cookieType: 'premium', image: 'https://images.pexels.com/photos/27304325/pexels-photo-27304325.jpeg', rating: 4.7, reviews: 189, discount: 20, inStock: true, description: 'Melt-in-mouth butter cookies made with premium ingredients.' },
    { id: 14, name: 'Healthy Oat Cookies', price: 299, originalPrice: 399, category: 'cookies', cookieType: 'healthy', image: 'https://images.pexels.com/photos/27304325/pexels-photo-27304325.jpeg', rating: 4.4, reviews: 87, discount: 25, inStock: true, description: 'Nutritious oat cookies with no added sugar. Perfect healthy snack.' },
  ]

  useEffect(() => {
    // Load cart and wishlist from localStorage
    const savedCart = localStorage.getItem('cart')
    const savedWishlist = localStorage.getItem('wishlist')
    if (savedCart) setCart(JSON.parse(savedCart))
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist))

    // Find the product
    const foundProduct = mockProducts.find(p => p.id === parseInt(productId))
    if (foundProduct) {
      setProduct(foundProduct)
      
      // Get related products (same category, excluding current)
      const related = mockProducts
        .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
        .slice(0, 4)
      setRelatedProducts(related)
    }
  }, [productId])

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
