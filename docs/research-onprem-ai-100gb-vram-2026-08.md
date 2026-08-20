# Research note: Enterprise on-prem AI with approximately 100 GB VRAM

## Scope

The folio already covers model routing, provider failover, SLOs, cost allocation, Kubernetes code sandboxes, multi-tenant platforms, semantic caching, and streaming LLM responses. It does not yet have a dedicated production playbook for selecting and serving small-to-medium local models under a fixed on-premise VRAM envelope. The new article should therefore focus on capacity planning, quantization trade-offs, GPU packing, concurrency/KV-cache budgeting, serving topology, enterprise isolation, and a benchmark-first rollout plan. It should not duplicate the existing model-router, FinOps, or Kubernetes articles.

## Sources and findings

1. vLLM, “Parallelism and Scaling,” https://docs.vllm.ai/en/stable/serving/parallelism_scaling/
   - vLLM documents single-GPU deployment when a model fits, single-node multi-GPU tensor parallelism when it does not, and combinations of tensor and pipeline parallelism for multi-node deployments.
   - The page explains that the GPU KV-cache size reports how many tokens can be stored concurrently and that maximum concurrency depends on the configured sequence length and available KV cache.
   - The article should use these as operational principles rather than promise a fixed throughput number; exact capacity must be benchmarked with the target model, prompt/output lengths, quantization, and hardware interconnect.

2. NVIDIA, “H100 GPU,” https://www.nvidia.com/en-us/data-center/h100/
   - Official product specifications list H100 SXM with 80 GB GPU memory and 3.35 TB/s memory bandwidth, and H100 NVL with 94 GB GPU memory and 3.9 TB/s bandwidth.
   - H100 supports FP8 in its fourth-generation Tensor Cores; the article should describe FP8 as a hardware/software option, not as a universal quality guarantee.
   - NVIDIA’s page includes vendor performance claims and third-party benchmark references; those should not be generalized as a production SLA. Use official memory specifications for sizing and require local benchmarking for throughput/latency claims.

## Initial modeling boundary

A nominal “100 GB VRAM total” is not the same as 100 GB available for model weights. Reserve headroom for runtime allocations, CUDA graphs, temporary buffers, fragmentation, and KV cache. The article should distinguish weight memory from serving memory and recommend leaving an explicit safety margin rather than filling every card to 100 percent.

3. NVIDIA, “L40S GPU for AI and Graphics Performance,” https://www.nvidia.com/en-us/data-center/l40s/
   - The page lists L40S FP32 91.6 TFLOPS, FP16 733 TFLOPS with sparsity, FP8 1,466 TFLOPS with sparsity, and 350 W maximum power consumption. The product page’s detailed specifications should be used for exact memory/ECC claims; the search result identifies 48 GB GDDR6 with ECC.
   - A 2×L40S layout gives 96 GB nominal VRAM, which is close to the requested 100 GB envelope but does not equal 100 GB usable. The article should make this distinction explicit and budget runtime headroom.

4. Hugging Face Transformers, “Quantization Overview,” https://huggingface.co/docs/transformers/quantization/overview
   - Quantization lowers memory requirements by storing weights at lower precision while trying to preserve accuracy. The documentation describes FP32, FP16/BF16, and lower integer representations such as int8/int4, and notes that methods have different hardware support and trade-offs.
   - Some methods require calibration for accuracy/compression while others work on-the-fly. The article should treat quantization as an evaluated deployment choice, not a free multiplier: measure quality, latency, context capacity, and failure modes on representative enterprise prompts.

## Candidate sizing heuristics to verify in the article

For rough planning only, weight memory is approximately parameter_count × bytes_per_weight before runtime overhead. FP16/BF16 is about 2 bytes per parameter, INT8 about 1 byte, and INT4 about 0.5 bytes; actual memory is higher because of scales, metadata, runtime buffers, CUDA graphs, and KV cache. These are engineering estimates, not vendor guarantees. Use explicit headroom and benchmark the exact model/engine.

5. Qwen, “Qwen3-14B,” https://huggingface.co/Qwen/Qwen3-14B
   - Model card lists 14.8B parameters, 32,768 native context, and validation up to 131,072 tokens with YaRN.
   - The card identifies Apache-2.0 licensing and gives deployment guidance for vLLM, SGLang, and llama.cpp, including an OpenAI-compatible endpoint path.
   - Long-context scaling materially changes KV-cache requirements; the article should not size a model from weight memory alone and should treat max-model-len as an explicit capacity variable.

6. Mistral AI, “Mistral-Small-3.1-24B-Instruct-2503,” https://huggingface.co/mistralai/Mistral-Small-3.1-24B-Instruct-2503
   - The model card identifies a 24B instruct model, Apache-2.0 license, multilingual support, and vLLM >= 0.8.1 as a recommended deployment path.
   - Search result metadata for the same model card reports a 128k context window. Treat this as a model capability, not as a default serving configuration; long context must be bounded by the actual KV-cache budget and workload.

## Research direction

The article’s central thesis should be that 100 GB total VRAM is a capacity envelope, not a model-size promise. A production design should choose a workload tier first, select a model family and precision second, reserve memory for runtime/KV cache third, and only then choose the GPU topology and serving engine. The strongest practical recommendation is likely a two-tier deployment: a small always-on model for high-volume classification/extraction/routing and a medium quantized model for harder generation, with a separate benchmark and admission policy for any larger model.
