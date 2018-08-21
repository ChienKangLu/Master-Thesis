1. 165 pois
2. 執行時間限制: 1 minute
3. 100 對 random pair poi
4. 早上8:00~晚上8:00
5. graph複雜度: 10 km, 20 km, 30 km, 40 km, 50 km, 60 km, none
6. 深度限制: 1, 2, ,3, ,4, ,5, 6, 7, 8, 9, 10
7. attribution using:
    a) attraction
    b) distance
    c) travelTime
    d) attraction+distance
    e) attraction+distance+travelTime
8. attraction heuristic: expectation-heuristic, none-heuristic
9. 資料結構: openlist, minheap
10. openlist comparator: comparator, comparator_heap, comparator_heap_normalize_gaussian

11. expectation-heuristic: forward-backward(average)

-----------------------------------------------------------------------------------

exp1:顯示expectation-heuristic可以提升速度
    testA:
        attribution: attraction
        attraction heuristic: *expectation-heuristic
        資料結構: minheap
        openlist comparator: comparator_heap
    testB:
        attribution: attraction
        attraction heuristic: *none-heuristic
        資料結構: minheap
        openlist comparator: comparator_heap
        total_duration:{"hours":12,"minutes":44,"seconds":39,"milliseconds":8}

exp2:同時考慮attraction和distance，看結果的分布趨勢
    testA:
        attribution: *attraction
        attraction heuristic: expectation-heuristic
        資料結構: minheap
        openlist comparator: comparator_heap_normalize_gaussian
        total_duration:{"hours":13,"minutes":19,"seconds":20,"milliseconds":1}

    testB:
        attribution: *attraction+distance
        attraction heuristic: expectation-heuristic, 直線距離
        資料結構: minheap
        openlist comparator: comparator_heap_normalize_gaussian
        total_duration:{"hours":17,"minutes":12,"seconds":29,"milliseconds":2}

exp3:單使用attraction和distance，取前N個最大的attraction，或看總距離的比較，理論最佳解
    testA:(同exp1的testA)
        attribution: *attraction
        attraction heuristic: expectation-heuristic
        資料結構: minheap
        openlist comparator: comparator_heap
    testB:
        attribution: *distance
        attraction heuristic: non-heuristic
        資料結構: minheap
        openlist comparator: comparator_heap
        資料結構: minheap
        total_duration:{"hours":12,"minutes":47,"seconds":16,"milliseconds":5}
