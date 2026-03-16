import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { TiersService } from './tiers.service';

@Controller('tiers')
export class TiersController {
    constructor(private readonly tiersService: TiersService) { }

    @Get()
    findAll() {
        return this.tiersService.findAll();
    }

    @Post()
    create(@Body() data: any) {
        return this.tiersService.create(data);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() data: any) {
        return this.tiersService.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.tiersService.remove(id);
    }
}
