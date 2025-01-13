---
layout: post
title: "Enhancing ClickHouse Architecture with Distributed Query Engines: A Cost-Effective Transformation"
excerpt: "Enhancing ClickHouse Architecture with Distributed Query Engines: A Cost-Effective Transformation"
authorslug: vasu_gupta
author: Vasu Gupta
---

## Preface
In high-performance data platforms, efficiency and scalability are paramount. ClickHouse, renowned for its blazing-fast analytics, is no exception. Our team recently transitioned from a traditional architecture—utilizing a combination of ReplicatedMergeTree and Distributed engines on the same nodes—to a more sophisticated distributed query engine design. This article explores the motivation behind this shift, the implementation, and the remarkable results.

## Old Architecture: Unified Nodes for Storage and Queries

Previously, our ClickHouse cluster consisted of nodes that served dual purposes: storage and query computation. The ReplicatedMergeTree engine managed circular data replication and data sharding, while the Distributed engine executed queries by routing them across the cluster.

## Challenges:

1. **High Computational Overhead on Write Nodes:** Write-heavy operations demanded significant computational resources, often resulting in hardware upgrades to sustain performance.
2. **Vertical Scalability Limitation:** Scaling involved increasing node capacities—an expensive and rigid approach.
3. **Underutilized Resources:** During low read-intensive workloads, computation resources on some nodes remained idle, leading to inefficient hardware utilization.

<div style="text-align:center; margin: 10px;">
	<img src="../images/2024/12/clickhouse-query-engine-old-arch.png">
</div>

## New Architecture: Decoupling Storage and Queries
The new architecture separates storage nodes from query computation nodes. Storage nodes retain the ReplicatedMergeTree engine, focusing solely on data ingestion and replication. Dedicated query nodes equipped with a horizontally scalable distributed query engine handle query execution and computation.
## Key Components:

1. **Storage Nodes:**
	* Run ReplicatedMergeTree for high-performance data storage and replication.
	* Handle raw data writes and ensure data durability.
2. **Query Nodes:**
	* Brings the raw data from all Clickhouse Storage Nodes according to filter applied and then perform final computations on that data on query nodes.
	* Perform computationally intensive operations such as aggregations, filtering, and joins.
3. **Load Balancing:**
	* A Google Load Balancer (GLB) directs read requests to query nodes according to CPU and memory usage of those nodes.

<div style="text-align:center; margin: 10px;">
	<img src="../images/2024/12/clickhouse-query-engine-new-arch.png">
</div>

## Benefits:
1. **Optimized Resource Utilization:**
	* By separating storage and query responsibilities, each layer can be optimized independently. Storage nodes are dedicated to handling data persistence, while query/computation nodes focus on processing queries, reducing resource contention.
	* Since query nodes are automatically horizontally scalable, only the required number of query nodes are running at the moment as per the current production load. As the load increases, the number of nodes also temporarily increases to not let the customer experience degrade. 
2. **Improved Scalability:**
	* The CH Storage Nodes layer is designed to scale vertically, which is beneficial for heavy storage demands. The CH Query/Computation Nodes layer, on the other hand, supports both horizontal and vertical scaling, allowing the system to handle more queries and distribute the computation load efficiently.
	* This architecture can scale by adding more computation nodes without increasing the resources on the storage layer.
3. **Enhanced Fault Tolerance:**
	* Using the Replicated Merge Tree for circular replication within the storage nodes ensures data redundancy and availability. In case of a node failure, other nodes in the replication circle can serve the data, enhancing resilience.
	* Our computation nodes are designed for high availability, ensuring uninterrupted service. If one node goes down, other nodes seamlessly take over query processing, maintaining reliability and minimizing downtime.
4. **Efficient Query Performance:**
	* The Distributed Engine in the computation nodes enables parallel query execution across multiple storage nodes, improving performance. Query nodes aggregate data before sending the results back, reducing the amount of data transferred to Read Layer and speeding up query response times.

## Results
1. **Performance:**
	* No observable impact on simple aggregate query response times.
	* Complex queries executed 10-15% faster, thanks to the dedicated computational capacity of the query nodes.
2. **Cost Savings:**
	* Write nodes now utilize lower-specification hardware, reducing operational expenses by 50%.
	* Horizontal scalability of query nodes allowed incremental scaling, avoiding large upfront investments.
3. **Operational Improvements:**
	* Simplified node management with distinct roles for storage and computation.
	* Enhanced fault tolerance as data intensive query failures no longer affect write operations directly.


4. **CPU Usages:**
	1. **Clickhouse Storage Nodes of old architecture:**
		<div style="text-align:center; margin: 20px;">
			<img src="../images/2024/12/clickhouse-query-engine-figure3.png">
		</div>
	2. **Clickhouse Storage Nodes of New Architecture:**
		<div style="text-align:center; margin: 20px;">
			<img src="../images/2024/12/clickhouse-query-engine-figure4.png">
		</div>

## Conclusion

* Separating storage and computation in our ClickHouse cluster has revolutionized our infrastructure. By leveraging distributed query engines, we achieved both **cost reduction** and **improved scalability** without compromising performance. This architecture not only meets current demands but also provides a **solid foundation for future growth**.
* This transition underscores the value of re-evaluating and optimizing architectural designs. For organizations relying on ClickHouse or similar systems, decoupling storage and computation **offers a compelling path** toward **operational efficiency**.

