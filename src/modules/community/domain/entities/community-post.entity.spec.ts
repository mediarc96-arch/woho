import { InvalidArgumentException } from '../../../../shared/domain/exceptions/domain.exception';
import { CommunityPost, PostType } from './community-post.entity';

function newPost(
  overrides: Partial<Parameters<typeof CommunityPost.create>[1]> = {},
): CommunityPost {
  return CommunityPost.create('p1', {
    authorId: 'u1',
    type: PostType.COMPANION,
    country: 'DE',
    city: 'Berlin',
    title: 'Looking for company',
    content: 'Club tour on Aug 15',
    ...overrides,
  });
}

describe('CommunityPost.create', () => {
  it('trims title and content, defaults travelDate to null', () => {
    const post = newPost({ title: '  Hi  ', content: '  body  ' });
    expect(post.title).toBe('Hi');
    expect(post.content).toBe('body');
    expect(post.travelDate).toBeNull();
  });

  it('keeps a provided travelDate', () => {
    const date = new Date('2026-08-15T00:00:00.000Z');
    expect(newPost({ travelDate: date }).travelDate).toEqual(date);
  });

  it('rejects an empty title', () => {
    expect(() => newPost({ title: '   ' })).toThrow(InvalidArgumentException);
  });

  it('rejects an empty content', () => {
    expect(() => newPost({ content: '' })).toThrow(InvalidArgumentException);
  });

  it('identifies its author', () => {
    const post = newPost({ authorId: 'u1' });
    expect(post.isAuthor('u1')).toBe(true);
    expect(post.isAuthor('u2')).toBe(false);
  });
});
