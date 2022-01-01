import Musicca, { MusiccaError, Song } from '../src';
import { MemoryQueue, FooExtractor, BarExtractor, RandomReadable } from './classes';

const client = new Musicca<MemoryQueue>({
  structs: {
    queue: MemoryQueue
  }
});

describe('initiating client', () => {
  test('should set queue struct to be MemoryQueue', () => {
    expect(client.queues.Struct).toBe(MemoryQueue);
  });

  test('should add new extractor', () => {
    const fooExtractor = new FooExtractor();
    const barExtractor = new BarExtractor();

    client.extractors.add(fooExtractor);
    client.extractors.add(barExtractor);

    expect(client.extractors.get('foo')).toBeInstanceOf(FooExtractor);
    expect(client.extractors.get('bar')).toBeInstanceOf(BarExtractor);

    expect(client.extractors.add.bind(client.extractors, fooExtractor)).toThrowError(MusiccaError.types.DUPLICATE_EXTRACTOR);
  });
});

describe('extracting', () => {
  const fooTitle = 'im foo';
  const barTitle = 'i went to a bar';

  test('should get correct output (foo)', () => client.extractors.extract(fooTitle)
    .then((res) => {
      expect(res).not.toBeNull();
      expect(res).toBeInstanceOf(Song);

      const song = res as Song;
      expect(song.data.title).toBe(fooTitle);
      expect(song.id).toBe('foo');

      return song.fetch();
    })
    .then((res) => {
      const stream = res as RandomReadable;
      expect(stream).toBeInstanceOf(RandomReadable);
      expect(stream.name).toBe('foo');
    })
  );

  test('should get correct output (bar)', () => client.extractors.extract(barTitle)
    .then((res) => {
      expect(res).not.toBeNull();
      expect(res).toBeInstanceOf(Song);

      const song = res as Song;
      expect(song.data.title).toBe(barTitle);
      expect(song.id).toBe('bar');

      return song.fetch();
    })
    .then((res) => {
      const stream = res as RandomReadable;
      expect(stream).toBeInstanceOf(RandomReadable);
      expect(stream.name).toBe('bar');
    })
  );
});

describe('queues', () => {
  const queue = client.queues.create();

  test('should create a memory queue', () => {
    expect(queue).toBeInstanceOf(MemoryQueue);
    expect(client.queues.get(queue)).toBe(queue);
  });

  const title = 'very foo';

  test('should return a random readable of foo', () => queue.play(title).then((res) => {
    const stream = res as RandomReadable;
    expect(stream).toBeInstanceOf(RandomReadable);
    expect(stream.name).toBe('foo');
  }));

  test('should append the results to the list', () => {
    const all = queue.all();
    expect(all.length).toBe(1);

    const first = all[0];
    expect(first.data.title).toBe(title);
  });
});