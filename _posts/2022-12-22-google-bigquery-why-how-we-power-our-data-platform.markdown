---
layout: post
title: "Google BigQuery: Why & How we power our Data Platform with it"
excerpt: "Google BigQuery: Why & How we power our Data Platform with it"
authorslug: vasu_gupta
author: Vasu Gupta
---

## Introduction

BigQuery is a completely serverless and cost-effective enterprise data warehouse provided by the Google Cloud Platform. Just like any other data warehouse present out there, it’s a relational database that is designed for read/write queries and data analysis. Do note that these databases are not optimized for transaction processing, which is the domain of OLTP systems. Data warehouses usually consolidate historical and analytic data derived from multiple sources. Data warehouses separate analysis workload from transaction workload and enable an organization to consolidate data from several sources.

## What do we do

[VWO](https://vwo.com/) is an experimentation platform that lets users run various kinds of A/B tests on their websites, apps, and products to optimize conversions on them. For this, we have to gather traffic from our client’s websites that have the VWO tool implemented in them. And once we store that traffic in our databases, we can provide our clients with meaningful insights from them. We, as a part of the Data Platform Team, are responsible for storing and retrieving this visitor’s data that VWO collects. 

## A little bit of History before BigQuery

Before we started with BigQuery, our entire data platform architecture was relying on Postgres which is an OLTP database (online transactional processing, that enables the real-time execution of large numbers of database transactions by large numbers of users). At that moment, the idea of custom events (defined by the client) was not implemented and we just had our own fixed number of internal events that were being captured into Postgres. Postgres worked wonderfully for us and even supports a majority of our legacy architecture as of now, but we encountered two major challenges with our Postgres cluster that made us look into other databases in the market. These challenges were:

* We use horizontal sharding in our Postgres Cluster on a specific column key. And, the major issue with sharding is that it’s difficult (not impossible) to horizontally scale Postgres as our data grows.
* For every feature present in our VWO platform, there is a dedicated table created for it, which is even further partitioned into. These tables belong to the internal events only that we were tracking. Therefore, it makes it difficult to ingest custom events into this database and then run event-based queries for a large corpus of data. Hence making our transition into an event-based architecture was tedious through Postgres.

## So what were our Requirements for a new Database?

Now it was time to search for a database that could meet our current as well as future requirements without any major hassle. The basic requirements were:

* In 2018, we were in the process of moving from our own server management infrastructure to a cloud-based system and we wanted to incorporate cloud managed services as much as possible so that developers can focus on their core product instead of worrying about managing and operating servers or runtimes. So it would be better to have some serverless solution for that database.
* Since our VWO platform is a write-heavy system, we needed a database that can handle high write throughput with quick read requests/data analysis. Therefore the idea was to get a data warehouse type of database.
* For Read Queries: we should be able to perform data analysis on any amount of historical data within seconds for a certain customer and it should not affect other customers in any way.
* The database should have a bunch of API Client Libraries so that we can plug and play this database with any known programming languages or frameworks.
* The database should be highly available and also should give us an appropriate balance between strong and eventual consistency.

## What BigQuery Brings to the Table for us

* **Serverless:** This means you don’t have to manage your VMs (Virtual Machines) for running/maintaining just a database. You also do not need to update BigQuery’s version manually, since it’s all being handled behind the scenes by Google Cloud with next to no downtimes.
* **Data Warehouse Capabilities:** It can work well with write-heavy architectures and can store petabytes of data without breaking a sweat.
* **Pricing:** Storage is cheap, and you are only billed for how much you read and write data, in contrast to self-managed databases which incurs cost just for maintaining them.
* **SQL Support:** BigQuery supports a standard SQL dialect that is ANSI 2011 compliant, which reduces the need for code rewrites. BigQuery also provides ODBC and JDBC drivers at no cost to ensure your current applications can interact with its powerful engine.
* **BigQuery ML:** Data scientists and data analysts can build and operationalize ML models on planet-scale structured, semi-structured, and unstructured data directly inside BigQuery, using simple SQL.
* **Tons of Metrics/Alerts:** Google Cloud provides all kinds of metrics related to BigQuery which you can find [here](https://cloud.google.com/monitoring/api/metrics_gcp#gcp-bigquery). This will help us to optimize our queries and estimate the costs for the future.

## Implementation of BigQuery in our Architecture

* BigQuery is acting as our data repository storing all the data points that are being collected. We, therefore, expect BigQuery to be always available. We want to treat BigQuery as the ultimate source of truth for our data. 
* Furthermore, we want to fetch data against some complex conditions/filters prescribed in real-time. Hence, BigQuery is expected to give results in real-time. We have solved this using complex SQL queries.
* In the future, we want to leverage BigQuery ML on the collected data to get heuristics and help in the prediction of users’ actions on the customers’ connected properties. This may help our customers to take pre-emptive decisions based on heuristics and alter the course of the user’s action to get the desired result.
* One interesting use case in which we have gone against the recommendations of BigQuery is multiple datasets and multiple tables. This helped us to segregate data and also helped in our query performance as we do not have to scan over the large chunk of data but rather a limited set.

## Some optimizations we did in BigQuery:

* **Partitioning**
    * Every read query of ours has a mandatory specific column filter to retrieve data, so it made sense to partition our tables on the basis of that specific column. It helped us to prevent the scanning of irrelevant rows, thereby decreasing query time and BigQuery slots usage.
* **Clustering**
    * Clustering sorts storage blocks based on the values in the clustered columns, it worked perfectly for us since there were certain columns that were majorly used for filtering data, and therefore we were able to reduce query time by approximately half whenever clustering columns were used in read queries.
* **Storage API**
    * BigQuery provides multiple types of API to interact with clients. If your use case is just to read/write data to BigQuery (i.e you don’t want to manage BigQuery resources such as datasets, jobs, or tables), then Storage API would be a perfect fit for you since it provides the fastest RPC APIs for read/write operations.

## Challenges we faced while using BigQuery

1. **Apache beam’s BigQueryIO library**

* **Context**
    * Apache Beam is a framework that lets you define and execute data processing pipelines, including ETL, batch, and stream processing. In simple words, you can create consumers/producers by plugging in different IOs (like BigQueryIO, PubSubIO, etc) directly. You can read more about this framework [here](https://beam.apache.org/documentation/).
    * We were using BigQueryIO (a library/plugin provided by Apache Beam itself) as our sink in our data pipeline. This means, we read data from message queues, do internal transformations and finally write data to BigQuery using Apache Beam’s BigQueryIO.

* **Problem**
    * One of the crucial parts of our BigQuery database is having multiple datasets and tables which means, we can have thousands of tables in different datasets. Now, this way of storing data created some issues while inserting data through Beam’s BigQueryIO library (we tested it on version 2.26.0).
    * First Issue, while using BigQueryIO for a large number of tables insertions, we found that it has an issue with its local caching technique for table creation. Tables are first searched in the local cache (in the consumer’s memory) and then checked whether to create a table or not. The main issue is when inserting into thousands of tables: let's suppose we have 10k tables to insert in realtime and now since we deploy a fresh dataflow pipeline after every PR merge, the local cache will be empty and it will take an enormous time just to build up that cache for 10k tables (since it will use BigQuery’s API to check if the table is already created or not) even though these 10k tables were already created in BigQuery.
    * Secondly, BigQueryIO does not create datasets dynamically i.e. if the pipeline consumes an entry for a new dataset, then BigQueryIO will not create a new dataset in our database thus leading to insertion failures.

* **Solution**
    * So we decided to write our own Custom BigQuery writer (as you can see in Figure 1) for Apache Beam. It not only resolved the issues that we had with the official BigQueryIO library but also was very performant in streaming data into BigQuery because we were using BigQuery’s Storage API for insertion.

**Figure 1:** In-depth explanation of the custom logic we used to improve upon the official BigQueryIO library

    <div style="text-align:center; margin: 10px;">
        <img src="../images/2022/12/google-bigquery-custom-writer-figure1.png">
    </div>

2. **Deletion/Updation of Rows**

* **Problem**
    * Although we understand that it is a bad practice to perform deletion/updation operations in a data warehouse type of database, still there are some 1% scenarios where we need to delete data that was recently ingested in BigQuery. 
    * For this, BigQuery says that when a row is inserted into the database through streams, they are present in a Streaming Buffer for 90 mins and you can not delete these rows for the same duration.
* **Solution**
    * We can’t really do much about it to circumvent this issue since it is a server-side thing and we as a user do not have control over it. But BigQuery provides a way to query the rows present in Streaming Buffer (the ones you can’t delete/update). Now you can perform your DML statements on certain rows after you verified that those rows are not present in the Streaming Buffer anymore.


3. **BigQuery Slots Usage**

* **Problem**
    * BigQuery slots are the computational capacity required to execute a SQL query. BigQuery uses the concept of slots in an interesting and efficient way to allocate resources so that your query can be executed parallelly in stages. Therefore depending on your query nature and the number of concurrent queries, slots will be consumed. So if you want to read multiple large queries parallely, then BigQuery slots might eat up the majority of your budget. 
* **Solution**
    * Try to optimize your read queries in BigQuery such that your query reads relevant data only, avoid joins such as a cartesian product that can create more output than input, and avoids DML statements that update or insert single rows only.
    * Since BigQuery Slots work on the basis of data size and query complexity, therefore it is always a good idea to keep your query as short and simple as possible.
    * We would suggest you to closely monitor slots usage when you are running this database in a production environment.

## Takeaways

It’s been 3 years since we are using BigQuery in our production environment with full write load (ingesting more than 250 million rows per day and being load tested at 10X the load mentioned with no whatsoever decrease in performance) and adequate read load so we can now say with complete confidence that BigQuery will not disappoint you if you are using it as a data warehouse database only. But if you try to use this as an OLTP database, then it might not be the right choice for you. Also, inserting data into BigQuery is cheap but do your calculations beforehand for the amount of BigQuery slots you would use to read the data.

## Helpful Resources

* [BigQuery Table Partitioning](https://cloud.google.com/bigquery/docs/partitioned-tables)
* [BigQuery Table Clustering](https://cloud.google.com/bigquery/docs/clustered-tables)
* [BigQuery Storage Write API](https://cloud.google.com/bigquery/docs/write-api#advantages)
* [BigQuery Storage Read API](https://cloud.google.com/bigquery/docs/reference/storage)
* [BigQuery Slots](https://cloud.google.com/bigquery/docs/slots)
* [BigQuery Optimizing Query Performance](https://cloud.google.com/bigquery/docs/best-practices-performance-overview)
* [Apache Beam Documentation](https://beam.apache.org/documentation/)
* [DACDN (Dynamic CDN)](https://engineering.wingify.com/posts/dynamic-cdn/)
