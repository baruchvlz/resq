# Performance

v1 converted the **entire** fiber tree into plain objects on every query, and then searched that copy.
v2 searches the fibers directly and only builds result objects for the matches.

What changed:

- **Lazy traversal.** The search walks `child` / `sibling` links iteratively. Nothing is copied.
- **`resq$` stops at the first match** instead of collecting every match and taking the first.
- **Lazy results.** `node` and `children` are resolved on first access.
- **Selectors are compiled once**, and the match for each component type is cached for the duration of a query.
- **Queue by index** instead of `Array.shift()`, which is quadratic on large arrays.
- **No duplicate work** when descendant chains have nested scopes.

## Benchmarks

Measured with `npm run bench` on synthetic fiber trees (10 children per fiber, a mix of components and host
elements), against the v1 implementation from `master` (`bench/baseline-v1`). Higher is better.

| Query | ~10k fibers | ~110k fibers |
| --- | --- | --- |
| First match (`Item3`) | 3,095× faster | 898,213× faster |
| All matches with a wildcard (`Item1*`) | 33× faster | 138× faster |
| Descendant chain (`Item2 Item4`) | 26× faster | 577× faster |

The first-match numbers are the best case: the match is close to the root, v2 stops there, and v1 still
converts everything. Queries that must visit every fiber, such as the wildcard row, are the realistic floor.

Results depend on your machine and tree shape. Run the benchmark yourself to compare:

```sh
npm run bench
```
