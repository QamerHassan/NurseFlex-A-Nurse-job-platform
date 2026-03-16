import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class BlogService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private emailService: EmailService,
    private notificationsService: NotificationsService
  ) {}

  // 1. Create Blog with Image and Detailed Content
  async create(data: any) {
    try {
      const blog = await this.prisma.blog.create({
        data: {
          title: data.title,
          content: data.content, // Long description yahan ayegi
          imageUrl: data.imageUrl, // [NEW] Image link handle karega
          category: data.category || "Nursing Tips",
          status: data.status || "Published",
          author: data.author || "Admin",
          sections: data.sections || null
        }
      });

      // Send email and in-app notifications if the blog is published
      if (blog.status === 'Published') {
        this.sendNewBlogNotifications(blog);
      }

      return blog;
    } catch (error) {
      console.error("PRISMA ERROR:", error);
      throw new InternalServerErrorException("Blog create karne mein masla aa raha hai, bhai!");
    }
  }

  private async sendNewBlogNotifications(blog: any) {
    try {
      const users = await this.usersService.findAllApprovedUsersByRoles(['NURSE', 'BUSINESS']);
      for (const user of users) {
        // 1. Email Notification
        await this.emailService.sendNewBlogNotification(user.email, blog.title, blog.id);
        
        // 2. In-App Notification
        await this.notificationsService.createNotification(
          (user as any).id, // Need user ID for DB relation
          'New Blog Update! 📖',
          `Admin has posted a new blog: "${blog.title}"`,
          'BLOG_POST',
          { blogId: blog.id }
        );
      }
    } catch (error) {
      console.error("FAILED TO SEND BLOG NOTIFICATIONS:", error);
    }
  }

  // 2. Get All Blogs (Latest first)
  async findAll() {
    return this.prisma.blog.findMany({ 
      orderBy: { createdAt: 'desc' } 
    });
  }

  // 3. Find Single Blog (For Details Page)
  async findOne(id: string) {
    const blog = await this.prisma.blog.findUnique({ where: { id } });
    if (!blog) throw new NotFoundException("Blog nahi mila!");
    return blog;
  }

  // 4. Update Blog (If needed)
  async update(id: string, data: any) {
    return this.prisma.blog.update({
      where: { id },
      data: { 
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl,
        category: data.category,
        status: data.status,
        sections: data.sections || undefined
      }
    });
  }

  // 5. Delete Blog
  async delete(id: string) {
    try {
      return await this.prisma.blog.delete({ where: { id } });
    } catch (error) {
      throw new NotFoundException("Blog pehle hi delete ho chuka hai.");
    }
  }
}