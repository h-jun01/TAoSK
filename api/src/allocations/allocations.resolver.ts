import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Allocation } from './allocation';
import { AllocationsService } from './allocations.service';
import { NewAllocationInput } from './dto/newAllocation.input';

@Resolver()
export class AllocationsResolver {
  constructor(private allocationService: AllocationsService) {}

  @Mutation(() => Allocation)
  public async CreateAllocation(
    @Args({ name: 'newAllocation' }) newAllocation: NewAllocationInput,
  ): Promise<Allocation> {
    return await this.allocationService
      .create({ newAllocation })
      .catch((err) => {
        throw err;
      });
  }

  @Mutation(() => [Allocation])
  public async UnAssignTask(
    @Args({ name: 'user_id' }) userId: string,
    @Args({ name: 'task_id' }) taskId: number,
  ): Promise<Allocation[]> {
    return await this.allocationService
      .unassign(userId, taskId)
      .catch((err) => {
        throw err;
      });
  }

  @Query(() => [Allocation])
  public async CompletedTask(
    @Args('userId') userId: string,
  ): Promise<Allocation[]> {
    return await this.allocationService.CompletedTask(userId).catch((err) => {
      throw err;
    });
  }
}
