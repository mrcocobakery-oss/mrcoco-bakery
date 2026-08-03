'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAdmin } from '@/contexts/AdminContext'
import { useRouter } from 'next/navigation'

export default function BakingCourseAdmin() {
  const { admin } = useAdmin()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [courseData, setCourseData] = useState({
    bannerImage: '',
    courses: []
  })

  useEffect(() => {
    if (!admin) {
      router.push('/admin/login')
      return
    }
    fetchCourseData()
  }, [admin, router])

  const fetchCourseData = async () => {
    try {
      const response = await fetch('/api/admin/baking-course')
      const data = await response.json()
      setCourseData(data.courseData)
    } catch (error) {
      console.error('Error fetching course data:', error)
      toast.error('Failed to fetch course data')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/baking-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData)
      })

      if (response.ok) {
        toast.success('Course data saved successfully!')
      } else {
        toast.error('Failed to save course data')
      }
    } catch (error) {
      toast.error('Error saving course data')
    } finally {
      setSaving(false)
    }
  }

  const addCourse = () => {
    setCourseData({
      ...courseData,
      courses: [
        ...courseData.courses,
        {
          id: `course-${Date.now()}`,
          name: '',
          duration: '',
          nextBatch: '',
          content: ['']
        }
      ]
    })
  }

  const removeCourse = (index) => {
    const newCourses = courseData.courses.filter((_, i) => i !== index)
    setCourseData({ ...courseData, courses: newCourses })
  }

  const updateCourse = (index, field, value) => {
    const newCourses = [...courseData.courses]
    newCourses[index] = { ...newCourses[index], [field]: value }
    setCourseData({ ...courseData, courses: newCourses })
  }

  const addContentItem = (courseIndex) => {
    const newCourses = [...courseData.courses]
    newCourses[courseIndex].content.push('')
    setCourseData({ ...courseData, courses: newCourses })
  }

  const updateContentItem = (courseIndex, contentIndex, value) => {
    const newCourses = [...courseData.courses]
    newCourses[courseIndex].content[contentIndex] = value
    setCourseData({ ...courseData, courses: newCourses })
  }

  const removeContentItem = (courseIndex, contentIndex) => {
    const newCourses = [...courseData.courses]
    newCourses[courseIndex].content = newCourses[courseIndex].content.filter((_, i) => i !== contentIndex)
    setCourseData({ ...courseData, courses: newCourses })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Baking Course Management</h1>
              <p className="text-gray-600">Manage course details, banners, and content</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} className="bg-pink-600 hover:bg-pink-700">
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        {/* Banner Image */}
        <Card className="mb-6 border-2 border-pink-200">
          <CardHeader>
            <CardTitle>Banner Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="bannerImage">Banner Image URL</Label>
              <Input
                id="bannerImage"
                value={courseData.bannerImage}
                onChange={(e) => setCourseData({ ...courseData, bannerImage: e.target.value })}
                placeholder="https://example.com/banner.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload banner image to image hosting service and paste URL here
              </p>
            </div>
            {courseData.bannerImage && (
              <div className="mt-4">
                <img
                  src={courseData.bannerImage}
                  alt="Banner preview"
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="200"%3E%3Crect fill="%23ddd" width="800" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EBanner Preview%3C/text%3E%3C/svg%3E'
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Courses */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Courses</h2>
            <Button onClick={addCourse} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Course
            </Button>
          </div>

          {courseData.courses.map((course, courseIndex) => (
            <Card key={course.id} className="border-2 border-gray-200">
              <CardHeader className="bg-gray-50">
                <div className="flex items-center justify-between">
                  <CardTitle>Course {courseIndex + 1}</CardTitle>
                  <Button
                    onClick={() => removeCourse(courseIndex)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Remove
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label>Course Name</Label>
                  <Input
                    value={course.name}
                    onChange={(e) => updateCourse(courseIndex, 'name', e.target.value)}
                    placeholder="e.g., Beginner Baking Course"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Duration</Label>
                    <Input
                      value={course.duration}
                      onChange={(e) => updateCourse(courseIndex, 'duration', e.target.value)}
                      placeholder="e.g., 4 Weeks (12 Sessions)"
                    />
                  </div>
                  <div>
                    <Label>Next Batch Date</Label>
                    <Input
                      type="date"
                      value={course.nextBatch}
                      onChange={(e) => updateCourse(courseIndex, 'nextBatch', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Course Content</Label>
                    <Button
                      onClick={() => addContentItem(courseIndex)}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Item
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {course.content.map((item, contentIndex) => (
                      <div key={contentIndex} className="flex gap-2">
                        <Input
                          value={item}
                          onChange={(e) => updateContentItem(courseIndex, contentIndex, e.target.value)}
                          placeholder="Content item"
                        />
                        <Button
                          onClick={() => removeContentItem(courseIndex, contentIndex)}
                          variant="ghost"
                          size="icon"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {courseData.courses.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No courses added yet</h3>
                <p className="text-gray-500 mb-4">Add your first course using the button above</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
