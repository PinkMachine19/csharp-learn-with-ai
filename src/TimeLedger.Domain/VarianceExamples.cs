namespace TimeLedger.Domain;

public interface ISource<out T> { T Get(); }
public interface ISink<in T> { void Add(T item); }

public sealed class SingleSource<T>(T item) : ISource<T> { public T Get() => item; }
public sealed class CountingSink<T> : ISink<T> { public int Count { get; private set; } public void Add(T item) => Count++; }
