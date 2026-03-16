import { Controller, Get, Post, Put, Body, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { BlogService } from './blog.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  @Get()
  async getAllBlogs() {
    return this.blogService.findAll();
  }

  @Get(':id')
  async getSingleBlog(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(@Body() body: any) {
    // 🔍 Terminal mein check karein ye print ho raha hai?
    console.log("RECEIVED BODY:", body);

    if (!body.title || !body.content) {
      return { success: false, message: "Title and Content are required!" };
    }

    return this.blogService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updatePost(@Param('id') id: string, @Body() body: any) {
    return this.blogService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    return this.blogService.delete(id);
  }
}